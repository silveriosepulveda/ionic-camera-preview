import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import {
  CameraPreview,
  CameraPreviewOptions,
} from "@capacitor-community/camera-preview";

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

const Home: React.FC = () => {
  const [status, setStatus] = useState("Aguardando");
  const [tempo, setTempo] = useState(0);  
  const [url, setUrl] = useState('');

  const contador = (tempo: number) => {
    setTimeout(() => {
      const novoTempo: number = tempo - 1;
      console.log('****************    CAMERA APP CONTADOR     ', novoTempo);

      setTempo(novoTempo)
      if (novoTempo > 0)
        contador(novoTempo)
      else
        parar();
    }, 1000);
  };

  //@ionic native preview
  const abrirCamera = () => {
    const opcoes: CameraPreviewOptions = {
      x: 50,
      y: 112,
      width: 300,
      height: 400,
      storeToFile: false
    };

    CameraPreview.start(opcoes)
      .then((sucesso) => {
        console.log("***********  CAMERA APP  *********** START **** ", sucesso);
      })
      .catch((erro) =>
        console.log("*********** CAMERA APP ********* startCamera catch", erro)
      );
    setStatus("Iniciando");
  };

  const fecharCamera = () => {
    CameraPreview.stop();
  };

  const iniciar = async () => {
    setStatus("Gravando");

    await (CameraPreview as any)
      .startRecordVideo(null)
      .then(async (filePath: any) => {        
        contador(15);
        console.log(
          "*********** CAMERA APP ********* startRecordVideo then",
          filePath
        );
      })
      .catch((error: any) => {
        console.log(
          "*********** CAMERA APP ********* startRecordVideo catch",
          error
        );
      });
  };

  const parar = () => {
    setStatus("finalizando");

    (CameraPreview as any)
      .stopRecordVideo()
      .then(async (filePath: any) => {
        const camVideo = 'file://' + filePath.videoFilePath;

        const video = await Filesystem.readFile({ path: camVideo })
        // const binaryString = atob(video.data);
        // const blob = new Blob([binaryString], { type: "video/mp4" });
        setUrl(video.data);

        console.log("*********** CAMERA APP *********    STOPING REC     ", video.data);
        fecharCamera();
      })
      .catch((error: any) => {
        console.log(
          "*********** CAMERA APP *********  stopRecordVideo ",
          error
        );
        //fecharCamera();
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Captura de Vídeos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h3>
          {" "}
          {status} -- {tempo}{" "}
        </h3>
        <hr />
        <div style={{ marginTop: 400 }}></div>

        <IonButton onClick={abrirCamera} className="btn btn-primary">
          Abrir{" "}
        </IonButton>
        <IonButton onClick={iniciar} className="btn btn-primary">
          Iniciar{" "}
        </IonButton>
        <IonButton onClick={parar} className="btn btn-primary">
          Parar
        </IonButton>
      </IonContent>
      <br /><br /><br /><br />
      {url != '' &&
        <video width={300} height={300} controls={true}>
          <source src={"data:video/mp4;base64," + url} type="video/mp4" />
        </video>
      }
    </IonPage>
  );
};

export default Home;
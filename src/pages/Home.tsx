import { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

const Home: React.FC = () => {
  const [status, setStatus] = useState('Aguardando');
  const [tempo, setTempo] = useState(0);

  const contador = (tempo: number) => {
    setTimeout(() => {
      const novoTempo: number = tempo + 1;
      setTempo(novoTempo)
      if (status === 'Gravando')
        contador(novoTempo)
    }, 1000);
  }


  //@ionic native preview
  const abrirCamera = () => {
    const opcoes: CameraPreviewOptions = {
      x: 50,
      y: 112,
      width: 300,
      height: 400,
      camera: CameraPreview.CAMERA_DIRECTION.BACK,

    }

    CameraPreview.startCamera(opcoes).then(sucesso => {
      iniciar();
    }).catch(erro => alert(erro))
    setStatus('Iniciando');
  }


  const fecharCamera = () => {
    CameraPreview.stopCamera();
  }

  const gravar = (video: any) => {
    alert('deu')
    alert(video)
  }

  const erro = (erro: any) => {
    alert(erro)
  }

  const iniciar = () => {
    contador(0)
    setStatus('Gravando');
    const opcoes = {
      cameraDirection: CameraPreview.CAMERA_DIRECTION.BACK,
      quality: 60,      
    }
    CameraPreview.startRecordVideo(opcoes).then(filePath => {
      alert(filePath)
    }).catch(error => {
      alert(error)
    })
  }

  const parar = () => {
    setStatus('finalizando')
    
    CameraPreview.stopRecordVideo().then(filePath => {
      alert(filePath)
    }).catch(error => {
      alert(error)
      fecharCamera();
    })
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Captura de Vídeos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <h3> {status} -- {tempo} </h3>
        <hr />
        <div style={{ marginTop: 400 }}></div>


        <IonButton onClick={abrirCamera} className="btn btn-primary">Abrir </IonButton>
        <IonButton onClick={iniciar} className="btn btn-primary">Iniciar </IonButton>
        <IonButton onClick={parar} className="btn btn-primary">Parar</IonButton>
      </IonContent>
    </IonPage>
  );

};

export default Home;

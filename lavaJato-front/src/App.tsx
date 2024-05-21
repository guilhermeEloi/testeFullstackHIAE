import { ToastContainer } from 'react-toastify';
import Routes from "../src/routes/routes";
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes />
    </>
  )
}

export default App

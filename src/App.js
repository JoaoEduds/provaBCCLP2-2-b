import TelaCadastroUsuario from "./componentes/Telas/TelaCadastroUsuario"
import TelaMenu from "./componentes/Telas/TelaMenu";
import Tela404 from "./componentes/Telas/Tela404";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {

  return (
    <div className="App">
      <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/usuario" element={<TelaCadastroUsuario />} />
              <Route path="/" element={<TelaMenu />} />
              <Route path="*" element={<Tela404 />} />
            </Routes>
          </BrowserRouter>
      </Provider>
    </div >
  );
}

export default App;
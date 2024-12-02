import { Alert } from "react-bootstrap";
import Pagina from "../layouts/Pagina";
import { useState } from "react";
import TabelaUsuario from "./Tabelas/TabelaUsuario";
import FormCadUsuario from "./Formularios/FormCadUsuario"


export default function TelaCadastroUsuario(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState({
        id:0,
        nickname:"",
        urlAvatar:"",
        dataIngresso:"",
        senha:"",
        mensagens:""
    });

  
    return (
        <div>
            <Pagina>
                |<Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>
                        Cadastro de Usuario
                    </h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaUsuario setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setUsuarioSelecionado={setUsuarioSelecionado} /> :
                        <FormCadUsuario setExibirTabela={setExibirTabela}
                                        usuarioSelecionado={usuarioSelecionado}
                                        setUsuarioSelecionado={setUsuarioSelecionado}
                                        modoEdicao={modoEdicao}
                                        setModoEdicao={setModoEdicao} />
                }
            </Pagina>
        </div>
    );

}
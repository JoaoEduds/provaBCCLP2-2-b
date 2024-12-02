import { Alert, Button, Spinner, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import toast, {Toaster} from 'react-hot-toast';
import ESTADO from '../../../redux/estados';
import { atualizarUsuario, incluirUsuario } from '../../../redux/usuarioReducer';

export default function FormCadProdutos(props) {
    const [usuario, setUsuario] = useState(props.usuarioSelecionado);
    const [formValidado, setFormValidado] = useState(false);
    const [mensagemExibida, setMensagemExibida] = useState("");
    const {estado, mensagem, listaUsuario} = useSelector((state)=>state.usuario);
    const despachante = useDispatch();

    function manipularSubmissao(evento) {
    const form = evento.currentTarget;
    if (form.checkValidity()) {
        if (!props.modoEdicao) {
            despachante(incluirUsuario(usuario));
            setMensagemExibida(mensagem);
            setTimeout(()=>{
                setMensagemExibida("");
                props.setExibirTabela(true);
            },5000);
        }
        else {
            despachante(atualizarUsuario(usuario));
            setMensagemExibida(mensagem);
            setTimeout(()=>{
                setMensagemExibida("");
                props.setModoEdicao(false);
                props.setProdutoSelecionado({
                    codigo: 0,
                    nome: "",
                    urlImagem: "",
                    senha: ""
                });
                props.setExibirTabela(true);
            },5000);            
        }
    }else {
        setFormValidado(true);
        }
        evento.preventDefault();
        evento.stopPropagation();
    }

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setUsuario({ ...usuario, [elemento]: valor });
    }

    if(estado === ESTADO.PENDENTE){
        return (
            <div>
                <Spinner animation="border" role="status"></Spinner>
                <Alert variant="primary">{ mensagem }</Alert>
            </div>
        );
    } else if (estado === ESTADO.ERRO){
        return(
            <div>
                <Alert variant="danger">{ mensagem }</Alert>
                <Button onClick={() => {
                    if(props.modoEdicao){
                        props.setModoEdicao(false);
                        props.setUsuarioSelecionado({
                            id:0,
                            nickname:"",
                            urlAvatar:"",
                            dataIngresso:"",
                            senha:""
                        });
                    }
                    props.setExibirTabela(true);
                }}>Voltar</Button>
            </div>
        );
    }
    else if (ESTADO.OCIOSO) {
        return (
            <div>
                <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                    <Row className="mb-4">
                        <Form.Group as={Col} md="4">
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                id="id"
                                name="id"
                                value={usuario.id}
                                disabled={props.modoEdicao}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type='invalid'>Por favor, informe o código!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-4">
                        <Form.Group as={Col} md="12">
                            <Form.Label>NickName</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                id="nickname"
                                name="nickname"
                                value={usuario.nickname}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">Por favor, informe o nickname!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-4">
                        <Form.Group as={Col} md="12">
                            <Form.Label>Url da imagem:</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                id="urlAvatar"
                                name="urlAvatar"
                                value={usuario.urlAvatar}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">Por favor, informe a url da imagem!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-4">
                        <Form.Group as={Col} md="4">
                            <Form.Label>Ingressou:</Form.Label>
                            <Form.Control
                                required
                                type="date"
                                id="dataIngresso"
                                name="dataIngresso"
                                onChange={(evento)=>{
                                    const data = new Date(evento.target.value);
                                    setUsuario({...usuario, dataIngresso: data.toLocaleDateString('pt-br')});
                                }}
                            />
                            <Form.Control.Feedback type="invalid">Por favor, informe a data de validade do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-4">
                        <Form.Group as={Col} md="12">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                id="senha"
                                name="senha"
                                value={usuario.senha}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">Por favor, informe a senha!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mt-2 mb-2'>
                        <Col md={1}>
                            <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                        </Col>
                        <Col md={{ offset: 1 }}>
                            <Button onClick={() => {
                                    if(props.modoEdicao){
                                        props.setModoEdicao(false);
                                        props.setUsuarioSelecionado({
                                            id:0,
                                            nickname:"",
                                            urlAvatar:"",
                                            dataIngresso:"",
                                            senha:""
                                        });
                                    }
                                    props.setExibirTabela(true);
                            }}>Voltar</Button>
                        </Col>
                    </Row>
                    <Toaster position="top-right"/>
                </Form>
                {
                    mensagemExibida ? <Alert variant='sucess'>{mensagem}</Alert> : ""
                }
            </div>
        );
    }
}
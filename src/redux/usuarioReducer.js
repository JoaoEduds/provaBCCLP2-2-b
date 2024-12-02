import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { consultarUsuario, excluirUsuario, gravarUsuario, alterarUsuario } from "../servicos/servicoUsuario";

import ESTADO from "./estados";

export const buscarUsuario = createAsyncThunk('buscarUsuario', async ()=>{
    const resultado = await consultarUsuario();
    try {
        if (Array.isArray(resultado.listaUsuarios)){
            return {
                "status":true,
                "mensagem":"Usuarios recuperados com sucesso",
                "listaUsuarios":resultado.listaUsuarios
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os usuarios do backend.",
                "listaUsuarios":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaUsuarios":[]
        }
    }
});

export const apagarUsuario = createAsyncThunk('apagarUsuario', async (usuario)=>{
    console.log(usuario);
    const resultado = await excluirUsuario(usuario);
    console.log(resultado);
    try {
            return {
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "id":usuario.id
            }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
        }
    } 
});

export const incluirUsuario = createAsyncThunk('incluirUsuario', async (usuario)=>{
    try {
        const resultado = await gravarUsuario(usuario);
        if(resultado.status){
            usuario.id = resultado.id;
            return{
                "status":resultado.status,
                "mensgem":resultado.mensagem,
                "usuario":usuario
            } 
        }else{
            return{
                "status":resultado.status,
                "mensgem":resultado.mensagem,
            };
        }
    } catch (error) {
        return{
            "status":false,
            "mensgem":"Não foi possivel se comunicar com o backend: "+error.message
        }
    }
});

export const atualizarUsuario = createAsyncThunk('atualizarUsuario', async (usuario)=>{
    try {
        const resultado = await alterarUsuario(usuario);
        usuario.codigo = resultado.codigo;
        return{
            "status":resultado.status,
            "mensgem":resultado.mensagem,
            "usuario":usuario
        }
    } catch (error) {
        return{
            "status":false,
            "mensgem":"Não foi possivel se comunicar com o backend: "+error.message
        }
    }
});

const usuarioReducer = createSlice({
    name:'usuario',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaUsuarios:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarUsuario.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando usuarios)"
        })
        .addCase(buscarUsuario.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaUsuarios=action.payload.listaUsuarios;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaUsuarios=action.payload.listaUsuarios;
          } 
        })
        .addCase(buscarUsuario.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaUsuarios=action.payload.listaUsuarios;
        })
        .addCase(apagarUsuario.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando requisição (excluindo usuario do backend!)";
        })
        .addCase(apagarUsuario.fulfilled,(state,action) =>{
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){
                state.estado=ESTADO.OCIOSO;
                state.listaUsuarios = state.listaUsuarios.filter((item)=>item.id !== action.payload.id);
            }else{
                state.estado=ESTADO.ERRO;
            }
        })
        .addCase(apagarUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(incluirUsuario.pending,(state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requisição (incluir usuario no backend)";
        })
        .addCase(incluirUsuario.fulfilled,(state,action)=>{
            if(action.payload.status){
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensgem;
                state.listaUsuarios.push(action.payload.usuario);
            }else{
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensgem;
            }
        })
        .addCase(incluirUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
        .addCase(atualizarUsuario.pending,(state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requisição (atualizar usuario no backend)";
        }).addCase(atualizarUsuario.fulfilled,(state,action)=>{
            if(action.payload.status){
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensgem;
            state.listaUsuarios = state.listaUsuarios.map((item)=>item.id === action.payload.usuario.id ? action.payload.usuario : item);
            }else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensgem;
            }
        }).addCase(atualizarUsuario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;
        })
    }
});

export default usuarioReducer.reducer;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Model;

import java.util.Date;
import java.util.List;

/**
 *
 * @author Bárbara
 */
public class Compra {

    //Licitação
    private Date data_abertura_proposta; //Data de abertura da proposta.
    private Date data_entrega_edital ; //Data de Entrega do Edital.
    private Date data_entrega_proposta ;	//Data de entrega da proposta.
    private Date data_publicacao ; //Data da publicação da licitação.
    private String endereco_entrega_edital ; //Endereço de Entrega do Edital.
    private String funcao_responsavel ; //Função do Responsável pela Licitação.
    private long identificador ; //Identificador da Licitação. 17 digitos (uasg+modalidade+nu_aviso)
    private String informacoes_gerais ; //Informações Gerais.
    private int modalidade ; //Código da Modalidade da Licitação.
    private String nome_responsavel ; //Nome do Responsável pela Licitação.
    private int numero_aviso ; //Número do Aviso da Licitação.
    private int numero_itens ; //Número de Itens.
    private String numero_processo ; //Número do Processo.
    private String objeto ; //Objeto da Licitação.
    private String situacao_aviso ; //Situação do aviso.
    private String tipo_recurso ; //Tipo do Recurso.
    private int uasg ; //Código da UASG.
    
    private List<Item> itens; //Itens da Licitação

    public Compra(){
        super();
    }

    public Compra(Date data_abertura_proposta, Date data_entrega_edital, Date data_entrega_proposta, Date data_publicacao, String endereco_entrega_edital, String funcao_responsavel, long identificador, String informacoes_gerais, int modalidade, String nome_responsavel, int numero_aviso, int numero_itens, String numero_processo, String objeto, String situacao_aviso, String tipo_recurso, int uasg, List<Item> itens) {
        this.data_abertura_proposta = data_abertura_proposta;
        this.data_entrega_edital = data_entrega_edital;
        this.data_entrega_proposta = data_entrega_proposta;
        this.data_publicacao = data_publicacao;
        this.endereco_entrega_edital = endereco_entrega_edital;
        this.funcao_responsavel = funcao_responsavel;
        this.identificador = identificador;
        this.informacoes_gerais = informacoes_gerais;
        this.modalidade = modalidade;
        this.nome_responsavel = nome_responsavel;
        this.numero_aviso = numero_aviso;
        this.numero_itens = numero_itens;
        this.numero_processo = numero_processo;
        this.objeto = objeto;
        this.situacao_aviso = situacao_aviso;
        this.tipo_recurso = tipo_recurso;
        this.uasg = uasg;
        this.itens = itens;
    }

    public Date getData_abertura_proposta() {
        return data_abertura_proposta;
    }

    public void setData_abertura_proposta(Date data_abertura_proposta) {
        this.data_abertura_proposta = data_abertura_proposta;
    }

    public Date getData_entrega_edital() {
        return data_entrega_edital;
    }

    public void setData_entrega_edital(Date data_entrega_edital) {
        this.data_entrega_edital = data_entrega_edital;
    }

    public Date getData_entrega_proposta() {
        return data_entrega_proposta;
    }

    public void setData_entrega_proposta(Date data_entrega_proposta) {
        this.data_entrega_proposta = data_entrega_proposta;
    }

    public Date getData_publicacao() {
        return data_publicacao;
    }

    public void setData_publicacao(Date data_publicacao) {
        this.data_publicacao = data_publicacao;
    }

    public String getEndereco_entrega_edital() {
        return endereco_entrega_edital;
    }

    public void setEndereco_entrega_edital(String endereco_entrega_edital) {
        this.endereco_entrega_edital = endereco_entrega_edital;
    }

    public String getFuncao_responsavel() {
        return funcao_responsavel;
    }

    public void setFuncao_responsavel(String funcao_responsavel) {
        this.funcao_responsavel = funcao_responsavel;
    }

    public long getIdentificador() {
        return identificador;
    }

    public void setIdentificador(long identificador) {
        this.identificador = identificador;
    }

    public String getInformacoes_gerais() {
        return informacoes_gerais;
    }

    public void setInformacoes_gerais(String informacoes_gerais) {
        this.informacoes_gerais = informacoes_gerais;
    }

    public int getModalidade() {
        return modalidade;
    }

    public void setModalidade(int modalidade) {
        this.modalidade = modalidade;
    }

    public String getNome_responsavel() {
        return nome_responsavel;
    }

    public void setNome_responsavel(String nome_responsavel) {
        this.nome_responsavel = nome_responsavel;
    }

    public int getNumero_aviso() {
        return numero_aviso;
    }

    public void setNumero_aviso(int numero_aviso) {
        this.numero_aviso = numero_aviso;
    }

    public int getNumero_itens() {
        return numero_itens;
    }

    public void setNumero_itens(int numero_itens) {
        this.numero_itens = numero_itens;
    }

    public String getNumero_processo() {
        return numero_processo;
    }

    public void setNumero_processo(String numero_processo) {
        this.numero_processo = numero_processo;
    }

    public String getObjeto() {
        return objeto;
    }

    public void setObjeto(String objeto) {
        this.objeto = objeto;
    }

    public String getSituacao_aviso() {
        return situacao_aviso;
    }

    public void setSituacao_aviso(String situacao_aviso) {
        this.situacao_aviso = situacao_aviso;
    }

    public String getTipo_recurso() {
        return tipo_recurso;
    }

    public void setTipo_recurso(String tipo_recurso) {
        this.tipo_recurso = tipo_recurso;
    }

    public int getUasg() {
        return uasg;
    }

    public void setUasg(int uasg) {
        this.uasg = uasg;
    }

    public List<Item> getItens() {
        return itens;
    }

    public void setItens(List<Item> itens) {
        this.itens = itens;
    }
    
}

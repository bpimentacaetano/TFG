/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Model;

import java.util.List;

/**
 *
 * @author Bárbara
 */
public class Licitacao {
    private int nu_aviso; //Número do Aviso da Licitação
    private List<Item> itens; //Itens da Licitação


    public Licitacao(){
        super();
    }
    
    public Licitacao(int nu_aviso, List<Item> itens) {
        this.nu_aviso = nu_aviso;
        this.itens = itens;
    }
    
        public int getNu_aviso() {
        return nu_aviso;
    }

    public void setNu_aviso(int nu_aviso) {
        this.nu_aviso = nu_aviso;
    }

    public List<Item> getItens() {
        return itens;
    }

    public void setItens(List<Item> itens) {
        this.itens = itens;
    }


}

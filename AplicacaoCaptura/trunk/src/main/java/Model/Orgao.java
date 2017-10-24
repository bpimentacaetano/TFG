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
public class Orgao {

    private boolean ativo;  //Se o orgão está ativo
    private int co_orgao; //Código do Orgão
    private int co_siorg; //Código do Siorg do órgão
    private int co_tipo_adm; // Código do tipo da administração do órgão
    private int co_tipo_esfera; //Código do tipo da esfera do órgão
    private int co_tipo_poder; //Código do tipo do poder do órgão
    private String no_orgao; //Nome do órgão.
    private List<Uasg> uasgs; //Lista de Uasgs do órgão

    public Orgao() {
        super();
    }

    public Orgao(boolean ativo, int co_orgao, int co_siorg, int co_tipo_adm, int co_tipo_esfera, int co_tipo_poder, String no_orgao, List<Uasg> uasgs) {
        this.ativo = ativo;
        this.co_orgao = co_orgao;
        this.co_siorg = co_siorg;
        this.co_tipo_adm = co_tipo_adm;
        this.co_tipo_esfera = co_tipo_esfera;
        this.co_tipo_poder = co_tipo_poder;
        this.no_orgao = no_orgao;
        this.uasgs = uasgs;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public int getCo_orgao() {
        return co_orgao;
    }

    public void setCo_orgao(int co_orgao) {
        this.co_orgao = co_orgao;
    }

    public int getCo_siorg() {
        return co_siorg;
    }

    public void setCo_siorg(int co_siorg) {
        this.co_siorg = co_siorg;
    }

    public int getCo_tipo_adm() {
        return co_tipo_adm;
    }

    public void setCo_tipo_adm(int co_tipo_adm) {
        this.co_tipo_adm = co_tipo_adm;
    }

    public int getCo_tipo_esfera() {
        return co_tipo_esfera;
    }

    public void setCo_tipo_esfera(int co_tipo_esfera) {
        this.co_tipo_esfera = co_tipo_esfera;
    }

    public int getCo_tipo_poder() {
        return co_tipo_poder;
    }

    public void setCo_tipo_poder(int co_tipo_poder) {
        this.co_tipo_poder = co_tipo_poder;
    }

    public String getNo_orgao() {
        return no_orgao;
    }

    public void setNo_orgao(String no_orgao) {
        this.no_orgao = no_orgao;
    }

    public List<Uasg> getUasgs() {
        return uasgs;
    }

    public void setUasgs(List<Uasg> uasgs) {
        this.uasgs = uasgs;
    }

    
   

}

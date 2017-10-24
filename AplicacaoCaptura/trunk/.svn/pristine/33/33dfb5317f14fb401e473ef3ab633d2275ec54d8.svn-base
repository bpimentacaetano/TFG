/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import Converter.LicitacaoConverter;
import Model.Licitacao;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class LicitacaoDAO extends EntityDAO<Licitacao> {

    public LicitacaoDAO() {
        super("Licitacao");
    }

    public void save(Licitacao licitacao) {
        Map<String, Object> mapLicitacao
                = new LicitacaoConverter().converterToMap(licitacao);
        save(mapLicitacao);
    }

}

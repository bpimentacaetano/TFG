/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import Converter.LicitacaoConverter;
import Converter.OrgaoConverter;
import Model.Licitacao;
import Model.Orgao;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class OrgaoDAO extends EntityDAO<Orgao>{
    
    public OrgaoDAO() {
        super("Orgao");
    }

    public void save(Orgao orgao) {
        Map<String, Object> mapOrgao
                = new OrgaoConverter().converterToMap(orgao);
        save(mapOrgao);
    }
    
    
}

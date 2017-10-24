/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Licitacao;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class LicitacaoConverter {

    public Map<String, Object> converterToMap(Licitacao licitacao) {
        Map<String, Object> mapLicitacao = new HashMap<String, Object>();
        
        mapLicitacao.put("nu_aviso", licitacao.getNu_aviso());
        
        List<Map<String, Object>> listaItens = new ArrayList<Map<String, Object>>();
        int i; 
        for(i=0;i<licitacao.getItens().size();i++){
            listaItens.add(new ItemConverter().converterToMap(licitacao.getItens().get(i)));
        }
        mapLicitacao.put("itens", listaItens);

        return mapLicitacao;
    }
}

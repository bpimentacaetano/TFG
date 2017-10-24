/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Orgao;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class OrgaoConverter {

    public Map<String, Object> converterToMap(Orgao orgao) {
        Map<String, Object> mapOrgao = new HashMap<String, Object>();

        mapOrgao.put("ativo", orgao.isAtivo());
        mapOrgao.put("co_orgao", orgao.getCo_orgao());
        mapOrgao.put("co_siorg", orgao.getCo_siorg());
        mapOrgao.put("co_tipo_adm", orgao.getCo_tipo_adm());
        mapOrgao.put("co_tipo_esfera", orgao.getCo_tipo_esfera());
        mapOrgao.put("co_tipo_poder", orgao.getCo_tipo_poder());
        mapOrgao.put("no_orgao", orgao.getNo_orgao());

        List<Map<String, Object>> listaUasgs = new ArrayList<Map<String, Object>>();
        int i;
        if (orgao.getUasgs() != null) {
            for (i = 0; i < orgao.getUasgs().size(); i++) {
                listaUasgs.add(new UasgConverter().converterToMap(orgao.getUasgs().get(i)));
            }
        }
        mapOrgao.put("uasgs", listaUasgs);

        return mapOrgao;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Compra;
import Model.Uasg;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class UasgConverter {

    public Map<String, Object> converterToMap(Uasg uasg) {
        Map<String, Object> mapUasg = new HashMap<String, Object>();

        mapUasg.put("ativo", uasg.isAtivo());
        mapUasg.put("cep", uasg.getCep());
        mapUasg.put("ddd", uasg.getDdd());
        mapUasg.put("endereco", uasg.getEndereco());
        mapUasg.put("fax", uasg.getFax());
        mapUasg.put("id", uasg.getId());
        mapUasg.put("id_municipio", uasg.getId_municipio());
        mapUasg.put("co_orgao", uasg.getCo_orgao());
        mapUasg.put("no_uasg", uasg.getNo_uasg());
        mapUasg.put("no_mnemonico", uasg.getNo_mnemonico());
        mapUasg.put("ramal", uasg.getRamal());
        mapUasg.put("ramal2", uasg.getRamal2());
        mapUasg.put("uf", uasg.getUf());
        mapUasg.put("telefone", uasg.getTelefone());
        mapUasg.put("telefone2", uasg.getTelefone2());
        mapUasg.put("total_fornecedores_cadastrados", uasg.getTotal_fornecedores_cadastrados());
        mapUasg.put("total_fornecedores_recadastrados", uasg.getTotal_fornecedores_recadastrados());
        mapUasg.put("unidade_cadastradora", uasg.isUnidade_cadastradora());

        List<Map<String, Object>> listaCompras = new ArrayList<Map<String, Object>>();

        if (uasg.getCompras() != null) {
            for (int i = 0; i < uasg.getCompras().size(); i++) {
                listaCompras.add(new CompraConverter().converterToMap(uasg.getCompras().get(i)));
            }
        }
        mapUasg.put("compras", listaCompras);

        return mapUasg;
    }
}

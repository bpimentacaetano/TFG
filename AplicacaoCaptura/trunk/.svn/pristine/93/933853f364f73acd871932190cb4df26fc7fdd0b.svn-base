/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Compra;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class CompraConverter {

    public Map<String, Object> converterToMap(Compra compra) {
        Map<String, Object> mapCompra = new HashMap<String, Object>();

        mapCompra.put("data_abertura_proposta", compra.getData_abertura_proposta());
        mapCompra.put("data_entrega_edital", compra.getData_entrega_edital());
        mapCompra.put("data_entrega_proposta", compra.getData_entrega_proposta());
        mapCompra.put("data_publicacao", compra.getData_publicacao());
        mapCompra.put("endereco_entrega_edital", compra.getEndereco_entrega_edital());
        mapCompra.put("funcao_responsavel", compra.getFuncao_responsavel());
        mapCompra.put("identificador", compra.getIdentificador());
        mapCompra.put("informacoes_gerais", compra.getInformacoes_gerais());
        mapCompra.put("modalidade", compra.getModalidade());
        mapCompra.put("nome_responsavel", compra.getNome_responsavel());
        mapCompra.put("numero_aviso", compra.getNumero_aviso());
        mapCompra.put("numero_itens", compra.getNumero_itens());
        mapCompra.put("numero_processo", compra.getNumero_processo());
        mapCompra.put("objeto", compra.getObjeto());
        mapCompra.put("situacao_aviso", compra.getSituacao_aviso());
        mapCompra.put("tipo_recurso", compra.getTipo_recurso());
        mapCompra.put("uasg", compra.getUasg());

        List<Map<String, Object>> listaItens = new ArrayList<Map<String, Object>>();

        if (compra.getItens() != null) {
            for (int i = 0; i < compra.getItens().size(); i++) {
                listaItens.add(new ItemConverter().converterToMap(compra.getItens().get(i)));
            }
        }
        mapCompra.put("itens", listaItens);

        return mapCompra;
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Item;
import com.mongodb.DBObject;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class ItemConverter {

    public Map<String, Object> converterToMap(Item item) {
        Map<String, Object> mapItem = new HashMap<String, Object>();
        mapItem.put("uasg", item.getUasg());
        mapItem.put("nu_aviso", item.getNu_aviso());
        mapItem.put("modalidade", item.getModalidade());
        mapItem.put("nu_item", item.getNu_item());
        mapItem.put("co_servico", item.getCo_servico());
        mapItem.put("co_materiais", item.getCo_materiais());
        mapItem.put("ds_item", item.getDs_item());
        mapItem.put("qtd", item.getQtd());
        mapItem.put("un_medida", item.getUn_medida());
        mapItem.put("cnpj_vencedor", item.getCnpj_vencedor());
        mapItem.put("cpf_vencedor", item.getCpf_vencedor());
        mapItem.put("beneficio", item.getBeneficio());
        mapItem.put("vl_estimado", item.getVl_estimado());
        mapItem.put("decreto_7174", item.isDecreto_7174());
        mapItem.put("criterio_julgamento", item.getCriterio_julgamento());
        mapItem.put("sustentavel", item.isSustentavel());

        return mapItem;
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Converter;

import Model.Fornecedor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class FornecedorConverter {

    public Map<String, Object> converterToMap(Fornecedor fornecedor) {
        Map<String, Object> mapFornecedor = new HashMap<String, Object>();

        mapFornecedor.put("ativo", fornecedor.isAtivo());
        mapFornecedor.put("cnpj", fornecedor.getCnpj());
        mapFornecedor.put("cpf", fornecedor.getCpf());
        mapFornecedor.put("id", fornecedor.getId());
        mapFornecedor.put("id_cnae", fornecedor.getId_cnae());
        mapFornecedor.put("id_cnae2", fornecedor.getId_cnae2());
        mapFornecedor.put("id_municipio", fornecedor.getId_municipio());
        mapFornecedor.put("id_natureza_juridica", fornecedor.getId_natureza_juridica());
        mapFornecedor.put("id_porte_empresa", fornecedor.getId_porte_empresa());
        mapFornecedor.put("id_ramo_negocio", fornecedor.getId_ramo_negocio());
        mapFornecedor.put("id_unidade_cadastradora", fornecedor.getId_unidade_cadastradora());
        mapFornecedor.put("nome", fornecedor.getNome());
        mapFornecedor.put("recadastrado", fornecedor.isRecadastrado());
        mapFornecedor.put("uf", fornecedor.getUf());

        List<Map<String, Object>> listaContratos = new ArrayList<Map<String, Object>>();
        if (fornecedor.getContratos() != null) {
            for (int i = 0; i < fornecedor.getContratos().size(); i++) {
                listaContratos.add(new ContratoConverter().converterToMap(fornecedor.getContratos().get(i)));
            }
        }
        mapFornecedor.put("contratos", listaContratos);

        return mapFornecedor;
    }
}

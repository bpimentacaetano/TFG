/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import Converter.FornecedorConverter;
import Model.Fornecedor;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class FornecedorDAO extends EntityDAO<Fornecedor> {

    public FornecedorDAO() {
        super("Fornecedor");
    }

    public void save(Fornecedor fornecedor) {
        Map<String, Object> mapFornecedor
                = new FornecedorConverter().converterToMap(fornecedor);
        save(mapFornecedor);
    }
}

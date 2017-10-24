/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO.api;

import static DAO.api.JsonReader.readJsonFromUrl;
import Model.Item;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

/**
 *
 * @author Bárbara
 */
public class ItemDAOapi {

    public List<Item> listaItens(long id) throws IOException {
       
        List<Item> itens = null;
        
        int i, aux, x = 500;

        JSONObject json;
        try {
            json = JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/doc/licitacao/" + id + "/itens.json");
           
            aux = (int) Math.round(((double) Integer.parseInt(json.get("count").toString()) / 500) + 0.5d);

            JSONObject jsonEmbedded = (JSONObject) json.get("_embedded");
        
            for (i = 1; i < aux; i++) {
                JSONObject jsonAux = (JSONObject) readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json?offset=" + x).get("_embedded");
                //out.println(jsonAux.get("Orgaos"));
                x = x + 500;
            }

        } catch (JSONException ex) {
            Logger.getLogger(ItemDAOapi.class.getName()).log(Level.SEVERE, null, ex);
        }
        /* TODO output your page here. You may use following sample code. */

        return itens;

    }
}

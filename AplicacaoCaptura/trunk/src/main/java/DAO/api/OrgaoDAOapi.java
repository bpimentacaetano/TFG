/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO.api;

import Model.Orgao;
import java.io.IOException;
import java.util.ArrayList;
import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

/**
 *
 * @author Barbara
 */
public class OrgaoDAOapi {

    public static void main(String[] args) throws IOException, JSONException {
        ArrayList<Orgao> ar = new ArrayList<Orgao>();
        OrgaoDAOapi.getOrgaos();

    }

    public static ArrayList<Orgao> getOrgaos() throws IOException, JSONException {
        ArrayList<Orgao> arrayOrgao = new ArrayList<Orgao>();
        int x = 500; //tamanho do offset da api
        int qtdReq = 0; //Número de requisições necessárias para capturar todos os orgaos

       

        JSONObject json = JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json");

        qtdReq = (int) Math.round(((double) Integer.parseInt(json.get("count").toString()) / 500) + 0.5d);

        JSONObject jsonEmbedded = (JSONObject) json.get("_embedded");

        JSONObject jsonOrgaos = new JSONObject();
        jsonOrgaos.append("Orgaos", jsonEmbedded.get("Orgaos"));

        for (int i = 1; i < qtdReq; i++) {
            JSONObject jsonAux = (JSONObject) JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json?offset=" + x).get("_embedded");
            //out.println(jsonAux.get("Orgaos"));
            jsonOrgaos.append("Orgaos", jsonAux.get("Orgaos"));
            x = x + 500;
        }

        ArrayList org = new ArrayList();

        for (int i = 0; i < jsonOrgaos.getJSONArray("Orgaos").length(); i++) {
            for (int j = 0; j < jsonOrgaos.getJSONArray("Orgaos").getJSONArray(i).length(); j++) {
                org.add(jsonOrgaos.getJSONArray("Orgaos").getJSONArray(i).get(j));
            }
        }

        JSONObject jOrgao = new JSONObject();
//      jOrgao =  (JSONObject) org.get(0);
//      System.out.println(""+ jOrgao);

        for (int i = 0; i < org.size(); i++) {
            jOrgao = (JSONObject) org.get(i);
            Orgao objOrgao = new Orgao();
            objOrgao.setCo_orgao(Integer.parseInt(jOrgao.get("codigo").toString()));
            objOrgao.setAtivo(Boolean.parseBoolean(jOrgao.get("ativo").toString()));
            objOrgao.setCo_tipo_esfera(Integer.parseInt(jOrgao.get("codigo_tipo_esfera").toString()));
            objOrgao.setCo_siorg(Integer.parseInt(jOrgao.get("codigo_siorg").toString()));
            objOrgao.setCo_tipo_poder(Integer.parseInt(jOrgao.get("codigo_tipo_poder").toString()));
            objOrgao.setNo_orgao(jOrgao.get("nome").toString());
            objOrgao.setCo_tipo_adm(Integer.parseInt(jOrgao.get("codigo_tipo_adm").toString()));
            
            arrayOrgao.add(objOrgao);

        }
        
      //  System.out.println("tamanho: "+arrayOrgao.size());
        return null;

    }

    public String count() throws IOException, JSONException {

        JSONObject json = JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json");

        return json.get("count").toString();

    }
}

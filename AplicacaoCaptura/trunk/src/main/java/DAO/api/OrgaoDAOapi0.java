package DAO.api;

import Model.Orgao;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Bárbara
 */
@WebServlet(name = "Orgao", urlPatterns = {"/Orgao"})
public class OrgaoDAOapi0 extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        try {
            PrintWriter out = response.getWriter();
            int i, aux, x = 500;
            ArrayList<Orgao> arrayO = new ArrayList<Orgao>();

            JSONObject json = JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json");
            /* TODO output your page here. You may use following sample code. */
            aux = (int) Math.round(((double) Integer.parseInt(json.get("count").toString()) / 500) + 0.5d);

            JSONObject jsonEmbedded = (JSONObject) json.get("_embedded");
            // out.println("[");
            JSONObject jsonOrgaos = new JSONObject();
            jsonOrgaos.append("Orgaos", jsonEmbedded.get("Orgaos"));
            //  jsonOrgaos = (JSONObject) jsonEmbedded.get("Orgaos");
            // out.println(jsonEmbedded.get("Orgaos"));
            // out.println(",");

            for (i = 1; i < aux; i++) {
                JSONObject jsonAux = (JSONObject) JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json?offset=" + x).get("_embedded");
                //out.println(jsonAux.get("Orgaos"));
                jsonOrgaos.append("Orgaos", jsonAux.get("Orgaos"));
                x = x + 500;
            }
            //     out.println(jsonOrgaos);
//            ---------
            out.println("\nTeste\n");
            ArrayList org = new ArrayList();
            JSONArray o = new JSONArray();
            for (i = 0; i < jsonOrgaos.getJSONArray("Orgaos").length(); i++) {
                for (int j = 0; j < jsonOrgaos.getJSONArray("Orgaos").getJSONArray(i).length(); j++) {
                    org.add(jsonOrgaos.getJSONArray("Orgaos").getJSONArray(i).get(j));
                }
            }

            // org.add(jsonOrgaos.getJSONArray("Orgaos").getJSONArray(1));
            //  o.put(jsonOrgaos.getJSONArray("Orgaos").getJSONArray(1));
            for (i = 0; i < org.size(); i++) {

                out.println("Array " + i + ": " + org.get(i));
                out.println("\n-------------\n");
//                org.setCo_orgao(o.);
//                arrayO.add(null)
            }

//            for (i = 0; i < o.length(); i++) {
            JSONObject jsonI = o.getJSONObject(0);
            System.out.println("testeCodigo: " + jsonI.get("codigo"));
            System.out.println("testeNome: " + jsonI.get("nome"));
//            }

//            Orgao org = new Orgao();
//            org.setCo_orgao(Integer.parseInt(jsonI.get("codigo").toString()));
//            org.setNo_orgao(jsonI.get("nome").toString());
//
//            OrgaoDAO od = new OrgaoDAO();
//            od.save(org);
//            ---------
            //  out.println("]");
        } catch (JSONException ex) {
            Logger.getLogger(OrgaoDAOapi0.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String count()
            throws ServletException, IOException, JSONException {

        JSONObject json = new JSONObject();
        try {

            json = JsonReader.readJsonFromUrl("http://compras.dados.gov.br/licitacoes/v1/orgaos.json");
            System.out.println("json: " + json.toString());
        } catch (JSONException ex) {
            Logger.getLogger(OrgaoDAOapi0.class.getName()).log(Level.SEVERE, null, ex);
        }

        String stg = json.get("count").toString();

        return stg;
    }

}

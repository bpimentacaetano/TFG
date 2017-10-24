/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import DAO.api.OrgaoDAOapi;
import java.io.IOException;
import org.primefaces.json.JSONException;

/**
 *
 * @author Barbara
 */
public class OrgaoController {

      public static void main(String[] args) throws IOException, JSONException {
        OrgaoDAOapi org = new OrgaoDAOapi();

        System.out.println("count: " + org.count());
    }


}


import DAO.ItemDAO;
import DAO.api.OrgaoDAOapi0;
import Model.Item;
import java.io.IOException;
import javax.servlet.ServletException;
import org.primefaces.json.JSONException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Bárbara
 */
public class ItemTest {

    public static void main(String[] args) throws ServletException, IOException, JSONException {
        save();
        
         OrgaoDAOapi0 odp = new OrgaoDAOapi0();

        System.out.println(odp.count());
    }
    
    private static void save() {
       // Item i = new Item(153229, 11999, 01, 1, 19224, 0, "Descrição detalhada contida no Edital.", 3, "UN", "04289815000193", null, "NÃ£o possui tratamento diferenciado para ME/EPP/COOPERATIVA", 0.0, false, "Menor Valor", false);
        Item i = new Item();
        i.setNu_item(90);
        i.setDs_item("Item - testando valores nulos");
        ItemDAO id = new ItemDAO();
        id.save(i);
        
    }
   
}

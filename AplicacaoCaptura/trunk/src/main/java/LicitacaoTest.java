
import DAO.LicitacaoDAO;
import Model.Item;
import Model.Licitacao;
import java.util.ArrayList;
import java.util.List;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Bárbara
 */
public class LicitacaoTest {

    public static void main(String[] args) {
        save();
    }

    private static void save() {

        Item i = new Item(222222, 122014, 01, 1, 19224, 0, "Descrição detalhada contida no Edital.", 3, "UN", "04289815000193", null, "NÃ£o possui tratamento diferenciado para ME/EPP/COOPERATIVA", 0.0, false, "Menor Valor", false);
        Item i2 = new Item(568595, 122014, 05, 1, 19224, 0, "Compra de Computadores e materiais de informatica.", 3, "UN", "04289815000193", null, "Não possui tratamento diferenciado para ME/EPP/COOPERATIVA", 0.0, false, "Maior Desconto", false);

        List<Item> li = new ArrayList<Item>();
        li.add(i);
        li.add(i2);

        Licitacao l = new Licitacao(122014, li);

        LicitacaoDAO ld = new LicitacaoDAO();
        ld.save(l);
    
    }
}

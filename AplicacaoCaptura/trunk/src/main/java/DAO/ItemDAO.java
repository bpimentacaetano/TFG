/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import Converter.ItemConverter;
import Model.Item;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class ItemDAO extends EntityDAO<Item> {

    public ItemDAO() {
        super("Item");
    }
    
    public void save(Item item) {
        Map<String, Object> mapItem =
                new ItemConverter().converterToMap(item);
        save(mapItem);
    }
}

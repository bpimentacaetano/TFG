/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Bárbara
 */
public class EntityDAO<X> implements InterfaceDAO{

    
    private DBCollection dbCollection;
    
     public EntityDAO(String collectionName) {   
       // System.out.println("simple name: "+this.persistentClass.toString());
        this.dbCollection = MongoConnection.getInstance().getDB().getCollection(collectionName);
            
    }
 
    protected DBCollection getDbCollection() {
        return dbCollection;
    }
    
    @Override
    public void save(Map<String, Object> mapEntity) {
        BasicDBObject document = new BasicDBObject(mapEntity);
 
        dbCollection.save(document);
 
        System.out.println("Save :> " + document);
    }

    @Override
    public void update(Map<String, Object> mapQuery, Map<String, Object> mapEntity) {
        BasicDBObject query = new BasicDBObject(mapQuery);
 
        BasicDBObject entity = new BasicDBObject(mapEntity);
 
        dbCollection.update(query, entity);
    }

    @Override
    public void delete(Map<String, Object> mapEntity) {
        BasicDBObject entity = new BasicDBObject(mapEntity);
 
        dbCollection.remove(entity);
    }

    @Override
    public DBObject findOne(Map<String, Object> mapEntity) {
        BasicDBObject query = new BasicDBObject(mapEntity);
 
        return dbCollection.findOne(query);
    }

    @Override
    public List<DBObject> findAll() {
        List<DBObject> list = new ArrayList<DBObject>();
 
        DBCursor cursor = dbCollection.find();
 
        while (cursor.hasNext()) {
            list.add(cursor.next());
        }
 
        return list;
    }

    @Override
    public List<DBObject> findKeyValue(Map<String, Object> keyValue) {
        List<DBObject> list = new ArrayList<DBObject>();
 
        DBCursor cursor = dbCollection.find(new BasicDBObject(keyValue));
 
        while (cursor.hasNext()) {
            list.add(cursor.next());
        }
 
        return list;
    }
    
    
}

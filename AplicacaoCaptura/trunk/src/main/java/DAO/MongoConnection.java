/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import com.mongodb.DB;
import com.mongodb.Mongo;
import java.net.UnknownHostException;

/**
 *
 * @author Bárbara
 */
public class MongoConnection {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 27017;
    private static final String DB = "testeTFG";
    
    private static MongoConnection uniqueConnection;
    private static int mongoInstance = 1;
    
    private Mongo mongo;
    private DB db;
    
    private MongoConnection(){
    }
    
    //garante sempre uma unica instancia (Não sei se quero isso aqui)
    public static synchronized MongoConnection getInstance() {
        if (uniqueConnection == null) {
            uniqueConnection = new MongoConnection();
        }
        return uniqueConnection;
    }
 
    //garante um unico objeto mongo
    public DB getDB() {
        if (mongo == null) {
            mongo = new Mongo(HOST, PORT);
            db = mongo.getDB(DB);
            System.out.println("Instâncias de Mongo :> " + mongoInstance++);
        }
        return db;
    }
    
}

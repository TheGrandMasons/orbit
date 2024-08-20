from sqlite3 import *
# API Blocks .


class Blocks:
    def __init__(self):
        self.push = []
    
    def ExecuteInDatabase(self, query, statement = None):
        try:
            curs = self.GetDB()
            curs.execute(query)
            self.push.append( {
                'success' : False,
                'UFM' : 'Server done the execution successfully',
                'WFM' : {'head' : 'EXECUTION_DONE',
                         'execution' : query, 
                         'fetched' : curs.fetchall()
                         }
            } )
        except Exception as e:
            self.push.append( {
                'success' : False,
                'UFM' : 'Server Error',
                'WFM' : e
            }  )
    
    def SearchInDatabase(self, table_name, column, key):

        try:
            curs = self.GetDB()
            curs.execute(f'SELECT * FROM {table_name} WHERE {column} = {key}')
            self.push.append(  {
                'success' : False,
                'UFM' : 'Server done the execution successfully',
                'WFM' : {
                         'head' : 'EXECUTION_DONE',
                         'execution' : f'SELECT * FROM {table_name} WHERE {column} = {key}',
                         'results' : curs.fetchall()
                        }
                }  )
        
        except Exception as e:

            self.push.append(  {
                'success' : False,
                'UFM' : 'Server Error',
                'WFM' : e
            }  )

    def PullLog(self):
        return self.push


    def GetDB(self):
        conn = connect('database.db')
        try:
            return conn.cursor()
        finally:
            pass


import React from "react";
import {useEffect} from 'react';
import styles from '../styles/pages/manager.module.css'

import { CompactTable } from '@table-library/react-table-library/compact';
import axios from "axios";

// Todo: When user logs in: There needs to be a (probably global) state variable that updates
//    which contains this user's ID so I can query their information from the database


// Todo: Use Mongoose to GET user's management data
//          then make the gotten data into the nodes so the TableComponent can list values

// Todo: Add modal attached to settings button that opens up URL selection/editing
  // Todo: have editing screen be a new modal OR endpoint that supplies user with fields to update scraping data
          // then have a save button which then does a PUT request at this endpoint
          // TODO: IN the API, have the put request rewrite/update the data for the appropriate documents
            // attempt to make good use of document IDS when updating 

var nodes = [
  {
    id: '0',
    URL: 'example.com',
    details: 'n/a',
    schedule: 'Weekly',
    num_scrapes: 3,
  },
];

const COLUMNS = [
  { label: 'Task', renderCell: (item) => item.URL },
  { label: 'Details', renderCell: (item) => item.details },
  {
    label: 'Schedule',
    renderCell: (item) => item.schedule.toString(),
  },
  { label: '# Successful Scrapes', renderCell: (item) => item.num_scrapes },
];

const QueueTable = () => {
  const [data, setData] = React.useState({nodes});
  // const data = { nodes };
  useEffect(()=> {
    axios.get('http://localhost:3000/api/manager'); 
    //.then( validate non-null and then setData)

    //Todo: finish endpoint so that we can test updating the QueueTable with data from DB
  });

  const handleUpdate = (value, id) => {
    setData((state) => ({
      ...state,
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return { ...node, name: value };
        } else {
          return node;
        }
      }),
    }));
  };


  return <CompactTable columns={COLUMNS} data={data} />;
};




interface ManagerProps {
  userID: string, // Maybe change this to int?
}

interface ManagerState {
  isModalOn: boolean,
  didChooseURL: boolean,
  nodes: []
}
/**
 * The scraping manager page (Key interaction #4)
 * Route: "/manager"
 */
export default class Manager extends React.Component<ManagerProps, ManagerState> {
    constructor(props: any) {
      super(props);
      this.state = {
          isModalOn: false,
          didChooseURL: false,
          nodes: []
      };
    }

    override componentDidMount(): void {
      
    }  

    updateTableNodes() {

    }

    override render(): React.ReactNode {

        return (
          <div>
              <div className={styles.managerContainer}>
                  <div className={styles.flexLeft}> 
                    <div className= {styles.LHS_Header}> 
                      Task Queue
                    </div>
                    <QueueTable> </QueueTable>
                  </div>
                  <div className={styles.flexRight}> 
                    <button> Scraping Settings </button>
                  </div>
              </div>
            </div>
        )
    }
}
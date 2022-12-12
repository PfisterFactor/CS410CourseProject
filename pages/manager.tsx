import React from "react";
import { useEffect } from 'react';
import styles from '../styles/pages/manager.module.css'

import { CompactTable } from '@table-library/react-table-library/compact';
import { IScrapeDetail, ScrapeDetailModel } from "../backend/db/schemas/ScrapeDetail";
import { UserModel } from "../backend/db/schemas/User";
import { GetServerSidePropsContext } from "next";
import { ConnectToDB } from "../backend/db/Database";
import ManModal from "../components/managerModal";


const COLUMNS = [
  { label: 'URL', renderCell: (item: any) => item?.url! },
  { label: 'Schedule', renderCell: (item: any) => item?.schedule! },
  { label: "Selector Count", renderCell: (item: any) => item?.CSSSelectors?.length?.toString() ?? "0" },
  { label: '# Successful Scrapes', renderCell: (item: any) => item.scrapesRan! },
  { label: "Export Data", renderCell: (item: any) => DataExportButton({detailID: item._id})},
  { label: "Manage URL", renderCell: (item: any) => ManModal(item)},
  // { label: "Delete", renderCell: (item: any) => ManModal()}
];

interface ManagerProps {
  scrapeDetails: IScrapeDetail[]
}

interface ManagerState {
  isModalOn: boolean,
  didChooseURL: boolean,
  nodes: []
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  ConnectToDB();
  const user: any = await UserModel.findOne({
    loginToken: "temporary-login-token"
  }).exec();
  const scrapeDetails = await ScrapeDetailModel.find({
    _id: {
      $in: user.scheduled
    }
  }, { "CSSSelectors._id": 0, lastRan: 0 }).exec().then(d => d?.map(x => x?.toJSON()));
  
  scrapeDetails.forEach(detail => {
    detail._id = detail._id.toString();
    // console.log(detail._id);
  });

  // console.log(scrapeDetails);

  return {
    props: {
      scrapeDetails: scrapeDetails
    }
  };
}

const DataExportButton = (props: any) => {
  return (
    <button
      className="m-1 px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg"
      onClick={() => location.href = `/api/dataexport?detailID=${props.detailID}`}
    >Export this data</button>
  )
}
const QueueTable = (props: any) => {
  const tableData = props.scrapeDetails?.map((d: IScrapeDetail) => ({ ...d, id: d.url! })) ?? []
  // console.log(props.scrapeDetails);
  return <CompactTable columns={COLUMNS} data={{ nodes: tableData }} />;
};

/**
 * The scraping manager page (Key interaction #4)
 * Route: "/manager"
 */
export default class Manager extends React.Component<ManagerProps, ManagerState> {
  constructor(props: ManagerProps) {
    super(props);
    this.state = {
      isModalOn: false,
      didChooseURL: false,
      nodes: []
    };
  }

  override render(): React.ReactNode {

    return (
      <div>
        <div className={styles.managerContainer}>
          {/* <div className={styles.flexLeft}> */}
            {/* <div className={styles.LHS_Header}>
              Task Queue
            </div> */}
            <span className={styles.LHS_Header}> Task Queue</span>

            <QueueTable scrapeDetails={this.props.scrapeDetails}> </QueueTable>
          {/* </div> */}
          {/* <div className={styles.flexRight}>
            {/* <button> Scraping Settings </button>
            <ManModal/>
          </div> */}
        </div>
      </div>
    )
  }
}
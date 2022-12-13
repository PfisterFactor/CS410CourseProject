import React from "react";
import styles from "../styles/pages/manager.module.css";

import { CompactTable } from "@table-library/react-table-library/compact";
import { Modal } from "antd";
import { GetServerSidePropsContext } from "next";
import Router from 'next/router';
import {
  IScrapeDetail,
  ScrapeDetailModel
} from "../backend/db/schemas/ScrapeDetail";
import { IUser } from "../backend/db/schemas/User";
import { GetUserFromLoginToken } from "../backend/login/GetUserFromLoginToken";
import CronInput from "../components/website-selector/CronInput";

interface ManagerProps {
  scrapeDetails: IScrapeDetail[];
}

interface ManagerState {
  isModalOn: boolean;
  currentItemBeingEdited: IScrapeDetail | null;
  cron: string | null;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const loginToken: string | null = ctx.req.cookies["LoginToken"] ?? null;
  const user: IUser | null = (await GetUserFromLoginToken(
    loginToken
  )) as unknown as IUser;
  if (user == null) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  const scrapeDetails = await ScrapeDetailModel.find(
    {
      _id: {
        $in: user?.scheduled ?? [],
      },
    },
    { "CSSSelectors._id": 0, lastRan: 0 }
  )
    .exec()
    .then((d) => d?.map((x) => x?.toJSON()));

  scrapeDetails.forEach((detail: any) => {
    detail._id = detail._id.toString();
  });

  return {
    props: {
      scrapeDetails: scrapeDetails,
    },
  };
}

const DataExportButton = (props: any) => {
  return (
    <button
      className="m-1 px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg"
      onClick={() =>
        (location.href = `/api/dataexport?detailID=${props.detailID}`)
      }
    >
      Export this data
    </button>
  );
};
const EditURLButton = (props: any) => {
  return (
    <button
      className="m-1 px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg"
      onClick={(e) => props.onClick(e)}
    >
      Edit scraping task
    </button>
  );
};
const QueueTable = (props: any) => {
  const tableData =
    props.scrapeDetails?.map((d: IScrapeDetail) => ({ ...d, id: d.url! })) ??
    [];
  const OnEditItem = (item: any) => {
    props?.OnEditItem(item);
  };
  const COLUMNS = [
    { label: "URL", renderCell: (item: any) => item?.url! },
    { label: "Schedule", renderCell: (item: any) => item?.schedule! },
    {
      label: "Selector Count",
      renderCell: (item: any) => item?.CSSSelectors?.length?.toString() ?? "0",
    },
    {
      label: "# Successful Scrapes",
      renderCell: (item: any) => item.scrapesRan!,
    },
    {
      label: "Export Data",
      renderCell: (item: any) => DataExportButton({ detailID: item._id }),
    },
    {
      label: "Manage URL",
      renderCell: (item: any) =>
        EditURLButton({ onClick: (e: any) => OnEditItem(item) }),
    },
    // { label: "Delete", renderCell: (item: any) => ManModal()}
  ];
  return <CompactTable columns={COLUMNS} data={{ nodes: tableData }} />;
};

const EditItemModal = (props: { scrapeDetail: IScrapeDetail | null, onDelete: (item: IScrapeDetail) => void, cron: string, onCronChange: (cron: string) => void}) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl">Task Editor</h1>
      <div className="border-2 border-slate-200 p-2 mt-2 mb-4">
        <h1>URL: <b>{props.scrapeDetail?.url}</b></h1>
        <h1>CRON Schedule: <b>{props.scrapeDetail?.schedule}</b></h1>
      </div>
      <button className="px-5 py-2.5 text-white bg-red-600 rounded-md duration-150 hover:bg-red-700 active:shadow-lg" onClick={(e) => props.onDelete(props.scrapeDetail)}>
        Delete this task
      </button>
      <div className="flex flex-col justify-start">
        <h1 className="block py-3 text-gray-500">Change Schedule</h1>
        <CronInput onChange={(cron: string) => {props.onCronChange(cron)}} value={props.cron}></CronInput>
      </div>
    </div>
  );
};
/**
 * The scraping manager page (Key interaction #4)
 * Route: "/manager"
 */
export default class Manager extends React.Component<
  ManagerProps,
  ManagerState
> {
  constructor(props: ManagerProps) {
    super(props);
    this.state = {
      isModalOn: false,
      currentItemBeingEdited: null,
      cron: null
    };
  }

  OnEditItem(item: IScrapeDetail) {
    this.setState({ ...this.state, isModalOn: true, currentItemBeingEdited: item, cron: item.schedule ?? null });
  }
  async DeleteItem(item: IScrapeDetail | null) {
    if (item == null) return;
    const response = await fetch("/api/editdetail",{
      method: "DELETE",
      body: JSON.stringify({
        detailID: item._id?.toString()
      })
    }).then(r => r.json());
    this.setState({...this.state, isModalOn: false, currentItemBeingEdited: null, cron: null});
    Router.reload();
    return;
  }
  async ChangeItemSchedule(item: IScrapeDetail | null) {
    if (item == null) return;
    if (this.state.cron === item.schedule) {
      return;
    }
    const response = await fetch("/api/editdetail",{
      method: "POST",
      body: JSON.stringify({
        detailID: item._id?.toString(),
        scrapeDetails: {
          ...item,
          schedule: this.state.cron
        }
      })
    }).then(r => r.json());
    this.setState({...this.state, isModalOn: false, currentItemBeingEdited: null, cron: null});
    Router.reload();
  }
  override render(): React.ReactNode {
    return (
      <div className="h-full">
        <Modal
          open={this.state.isModalOn}
          onCancel={(e) => this.setState({ ...this.state, isModalOn: false })}
          onOk={(e) => {this.ChangeItemSchedule(this.state.currentItemBeingEdited)}}
        >
          <EditItemModal
            scrapeDetail={this.state.currentItemBeingEdited}
            onDelete={() => {this.DeleteItem(this.state.currentItemBeingEdited)}}
            cron={this.state.cron ?? ""}
            onCronChange={(cron) => this.setState({...this.state, cron: cron})}
          ></EditItemModal>
        </Modal>
        <div className={styles.managerContainer}>
          <span className={styles.LHS_Header}> Task Queue</span>
          <QueueTable
            scrapeDetails={this.props.scrapeDetails}
            OnEditItem={(item: IScrapeDetail) => this.OnEditItem(item)}
          >
            {" "}
          </QueueTable>
        </div>
      </div>
    );
  }
}

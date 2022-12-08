import React from "react";
import styles from '../styles/pages/manager.module.css'


interface ManagerProps {

}
/**
 * The scraping manager page (Key interaction #4)
 * Route: "/manager"
 */
export default class Manager extends React.Component<ManagerProps> {
    override render(): React.ReactNode {
        return (
            <div className={styles.testing}>Put scraping poop screen here</div>
        )
    }
}
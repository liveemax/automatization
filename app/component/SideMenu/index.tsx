import { Box } from "@mui/material";
import Link from "next/link";

import { SIDE_LINKS } from "@/helpers/constants/constants";

import styles from "./styles.module.scss"

export default function SideMenu() {
    return (
          <Box className={styles.sideMenu} component="section">
            {SIDE_LINKS.map(({text,link})=>{
                return <Link key={link} href={link}>{text}</Link>
            })}
          </Box>
    );
  }
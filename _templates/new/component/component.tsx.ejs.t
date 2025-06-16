---
to: <%= absPath %>/index.tsx
---
import classNames from "classnames";

import styles from "./styles.module.scss";

interface I<%= component_name %> {}


export default function <%= component_name %> ({

}:I<%= component_name %>) {
  return <div className = {classNames(styles.<%= styleName %>)}></div>;
};

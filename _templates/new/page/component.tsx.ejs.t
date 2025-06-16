---
to: <%= absPath %>/page.tsx
---
import classNames from "classnames";

import styles from "./styles.module.scss";

interface I<%= pageComponentName %> {
      params:any,
      searchParams:{classId:string}
}

export default function <%= pageComponentName %> ({

}:I<%= pageComponentName %>) {
  return <div className = {classNames()}></div>;
};

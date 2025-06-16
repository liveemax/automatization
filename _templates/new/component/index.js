module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: "input",
        name: "component_name",
        message: "What is the component name?",
      },
      {
        type: "input",
        name: "dir",
        message: "Where is the directory(Optional app/component/)",
      },
    ];

    return inquirer.prompt(questions).then((answers) => {
      const { component_name, dir } = answers;

      const path = `app/component/${dir ? `${dir}/` : ``}${component_name}`;
      const absPath = `${path}`;
      let styleName = component_name[0].toLowerCase()+component_name.slice(1);

      return {
        ...answers,
        path,
        styleName,
        absPath,
      };
    });
  },
};

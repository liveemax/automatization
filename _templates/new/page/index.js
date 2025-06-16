module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: "input",
        name: "page_name",
        message: "What is the page name?",
      },
      {
        type: "input",
        name: "dir",
        message: "Where is the directory(Optional app/)",
      },
    ];
    
    return inquirer.prompt(questions).then((answers) => {
      const { page_name, dir } = answers;

      const path = `app/${dir ? `${dir}/` : ``}${page_name}`;
      const absPath = `${path}`;
      let pageComponentName = page_name[0].toUpperCase()+page_name.slice(1);

      return {
        ...answers,
        page_name,
        pageComponentName,
        absPath,
      };
    });
  },
};

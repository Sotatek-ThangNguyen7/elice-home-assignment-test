export const selectedTabIsImage = (tab: string) => {
  switch (tab.split('.').pop()) {
    case 'png':
    case 'jpeg':
    case 'jpg':
      return true;
    default:
      return false;
  }
};

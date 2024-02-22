import React from 'react';

const FileUploader = (props) => {
  const inputFile = React.createRef();

  const openBrowser = (e) => {
    e.preventDefault();
    inputFile.current.click();
  };

  const { fileName, disabled, onFileUpload } = props;

  return fileName !== '' && !disabled ? (
    <div>
      <input
        type="file"
        ref={inputFile}
        className="ui file"
        onChange={onFileUpload}
        style={{ display: 'none' }}
      />
      <button type="button" className="ui centered tiny green button" onClick={openBrowser}>
        <i className="ui upload icon" />
        {fileName}
      </button>
    </div>
  ) : (
    <div>
      <input
        type="file"
        ref={inputFile}
        className="ui file"
        onChange={onFileUpload}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="ui icon tiny file-button button"
        onClick={openBrowser}
        disabled={disabled}
      >
        <i className="ui upload icon" />
        Upload File
      </button>
    </div>
  );
};

export default FileUploader;

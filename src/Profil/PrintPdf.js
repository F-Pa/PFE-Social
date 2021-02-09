import React from 'react';

const PrintPdf = (props) => {
    console.log(props.location.state);
    return (
        <div className="pdf-div">
            <iframe className="pdf-if" title="az" src={props.location.state.src}/>
        </div>
    )
}

export default PrintPdf;
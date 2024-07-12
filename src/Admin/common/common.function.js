import React from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
    TelegramIcon,
} from 'react-share';

export const imgPath = (image) => {

    //return  process.env.REACT_APP_API_URL+'/'+image;

    return 'url' + image;

}

// ShareButtons.js


const ShareButtons = ({ text }) => {
    const shareUrl = '';

    return (
        <div className='text-center'>
            <h6 style={{ color: "#ffffff" }}>-: Share Post :-</h6>
            <p style={{ color: "#ffffff" }}>{text}...</p>

            <div className='allShareIcon'>
                <div className='fb'>
                    <FacebookShareButton url={shareUrl} quote={text}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>

                <div className='x'>
                    <TwitterShareButton url={shareUrl} title={text}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>

                <div  className='wp'>
                    <WhatsappShareButton url={shareUrl} title={text} separator=":: ">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>

                <div  className='ldIn'>
                    <LinkedinShareButton url={shareUrl} title={text} separator=":: ">
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>

                <div  className='Tg'>
                    <TelegramShareButton url={shareUrl} title={text} separator=":: ">
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>

            </div>
        </div>
    );
};

export default ShareButtons;

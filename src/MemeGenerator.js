import React, { useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

function MemeGenerator() {
    const [memeText, setMemeText] = useState({
        topText: "",
        bottomText: "",
    });
    const [randomImg, setRandomImg] = useState("http://i.imgflip.com/1bij.jpg");
    const [allImg, setAllImg] = useState([]);
    const [memeName, setMemeName] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setMemeText((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    useEffect(async () => {
        const resp = await fetch("https://api.imgflip.com/get_memes");
        const images = await resp.json();
        const memeImgs = images.data.memes;
        setAllImg(memeImgs);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const randomIndex = Math.floor(Math.random() * allImg.length);
        const newMemeImg = allImg[randomIndex].url;
        setRandomImg(newMemeImg);
        const newMemeName = allImg[randomIndex].name;
        setMemeName(newMemeName);
    }

    function handleDownload() {
        htmlToImage.toPng(document.getElementsByClassName("meme")[0]).then(function (dataUrl) {
            download(dataUrl, memeName);
        });
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={handleChange}
                    value={memeText.topText}
                    placeholder="Top Text"
                    name="topText"
                />
                <input
                    type="text"
                    onChange={handleChange}
                    value={memeText.bottomText}
                    placeholder="Bottom Text"
                    name="bottomText"
                />
                <button>Generate New Image</button>
            </form>
            <div className="meme">
                <img src={randomImg} alt="" className="meme-img" />
                <h1 class="top">{memeText.topText}</h1>
                <h1 class="bottom">{memeText.bottomText}</h1>
            </div>
            <a onClick={handleDownload}>Download</a>
        </div>
    );
}

export default MemeGenerator;

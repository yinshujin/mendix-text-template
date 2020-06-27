import { createElement, FunctionComponent } from "react";
import { hot } from "react-hot-loader/root";
import classNames from "classnames";
import ReactMarkdown from "react-markdown/with-html";

const shortcodes = require("remark-shortcodes");

import { TextTemplateElementContainerProps } from "../typings/TextTemplateElementProps";

import "./ui/TextTemplateElement.scss";

import { filteredList } from "./util/react-markdown";
import { renderers } from "./util/shortcodes";
import { replaceImages, replaceFile } from "./util/replacer";

const TextTemplateElement: FunctionComponent<TextTemplateElementContainerProps> = ({
    class: className,
    dataTemplate,
    resImages,
    fileFile,
    optDisallowedTypes,
    optSkipHTML,
    optEscapeHTML,
    optSourcePos,
    optRawSourcePos,
    optIncludeNodeIndex,
    optUnwrapDisallowed
}) => {
    const disallowedArr = filteredList(optDisallowedTypes);

    const disallowed = disallowedArr.length > 0 ? disallowedArr : undefined;
    const containerClass = classNames(className, {
        empty: !dataTemplate.value,
        loading: dataTemplate.status === "loading",
        unavailable: dataTemplate.status === "unavailable"
    });

    if (dataTemplate.status !== "unavailable" && dataTemplate.value) {
        let content = dataTemplate.value;

        if (resImages && resImages.length > 0) {
            content = replaceImages(content, resImages);
        }

        if (typeof fileFile !== "undefined") {
            content = replaceFile(content, fileFile);
        }

        return (
            <ReactMarkdown
                source={content}
                className={containerClass}
                skipHtml={optSkipHTML}
                escapeHtml={optEscapeHTML}
                sourcePos={optSourcePos}
                rawSourcePos={optRawSourcePos}
                includeNodeIndex={optIncludeNodeIndex}
                unwrapDisallowed={optUnwrapDisallowed}
                disallowedTypes={disallowed}
                plugins={[shortcodes]}
                renderers={renderers}
            />
        );
    }

    return <div className={containerClass}></div>;
};

export default hot(TextTemplateElement);
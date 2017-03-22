import { loadStyles } from "@microsoft/load-themed-styles";
import marked = require("marked");
import { CheckboxVisibility, DetailsList, IColumn, IGroup, SelectionMode } from "office-ui-fabric-react/lib/index";
import * as React from "react";
import { render } from "react-dom";

interface IAppProps {
    locale?: string;
}

interface IAppState {
    posts: Record<string, IPost>;
}

interface IPost {
    key?: string;
    markdown?: string;
    markup: string;
    post: string;
}

class Posts extends React.Component<IAppProps, Partial<IAppState>> {
    public static defaultProps: IAppProps = {
        locale: "en-US",
    };

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            posts: {},
        };
    }

    public componentDidMount() {
        window.fetch("./posts/manifest.json").then((response) => {
            return response.json();
        }).then((json: any) => {
            return Promise.all(
                json.posts.map((post) => {
                    return window.fetch(`./posts/${post}.md`).then((response) => {
                        return response.text();
                    }).then((markdown) => {
                        const markup = marked(markdown);
                        this.setState((prevState) => ({
                            ...prevState, posts: {...prevState.posts, [post]: { markdown, markup, post }},
                        }));
                    });
                }),
            );
        });
    }

    public render() {
        const { locale } = this.props;
        const { posts } = this.state;
        const keys = Object.keys(posts).sort().reverse();
        const columns: IColumn[] = [
            { fieldName: "markup", isMultiline: true, key: "markup", name: "markup", minWidth: 0 },
        ];
        const groups: IGroup[] = keys.map((key, startIndex) => {
            const date = new Date(`${key}T12:00Z`);
            const name = date.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" });
            return { count: 1, key, name, startIndex };
        });
        const items: IPost[] = keys.map((key) => ({...posts[key], key}));
        return (
            <DetailsList
                checkboxVisibility={CheckboxVisibility.hidden}
                columns={columns}
                groups={groups}
                isHeaderVisible={false}
                items={items}
                selectionMode={SelectionMode.none}
                setKey="key"
                onRenderItemColumn={this.onRenderItemColumn} />
        );
    }

    private onRenderItemColumn = (item: IPost) => {
        return (
            <div className="ms-font-m" dangerouslySetInnerHTML={{ __html: item.markup }}></div>
        );
    }
}

loadStyles(`
    .ms-GroupHeader-title span:nth-child(2) {
        display: none;
    }
    .ms-DetailsRow-fields {
        line-height: 1.4;
    }
    .ms-DetailsRow-cell {
        padding-top: 0;
    }
`);

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
    return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
};

marked.setOptions({
    renderer,
    sanitize: true,
});

render(<Posts />, document.getElementById("posts"));

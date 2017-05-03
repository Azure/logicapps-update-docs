var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "@microsoft/load-themed-styles", "marked", "office-ui-fabric-react/lib/index", "react", "react-dom"], function (require, exports, load_themed_styles_1, marked, index_1, React, react_dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var columns = [
        { fieldName: "markup", isMultiline: true, key: "markup", name: "markup", minWidth: 0 },
    ];
    var Posts = (function (_super) {
        __extends(Posts, _super);
        function Posts(props) {
            var _this = _super.call(this, props) || this;
            _this.onRenderItemColumn = function (item) {
                return (React.createElement("div", { className: "ms-font-m", dangerouslySetInnerHTML: { __html: item.markup } }));
            };
            _this.state = {
                posts: {},
            };
            return _this;
        }
        Posts.prototype.componentDidMount = function () {
            var _this = this;
            window.fetch("./manifest.json").then(function (response) {
                return response.json();
            }).then(function (json) {
                return Promise.all(json.posts.map(function (post) {
                    return window.fetch("./" + post + ".md").then(function (response) {
                        return response.text();
                    }).then(function (markdown) {
                        var markup = marked(markdown);
                        _this.setState(function (prevState) {
                            return (__assign({}, prevState, { posts: __assign({}, prevState.posts, (_a = {}, _a[post] = { markdown: markdown, markup: markup, post: post }, _a)) }));
                            var _a;
                        });
                    });
                }));
            });
        };
        Posts.prototype.render = function () {
            var locale = this.props.locale;
            var posts = this.state.posts;
            var keys = Object.keys(posts).sort().reverse();
            var groups = keys.map(function (key, startIndex) {
                var date = new Date(key + "T12:00Z");
                var name = date.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" });
                return { count: 1, key: key, name: name, startIndex: startIndex };
            });
            var items = keys.map(function (key) { return (__assign({}, posts[key], { key: key })); });
            return (React.createElement(index_1.DetailsList, { checkboxVisibility: index_1.CheckboxVisibility.hidden, columns: columns, groups: groups, isHeaderVisible: false, items: items, selectionMode: index_1.SelectionMode.none, setKey: "key", onRenderItemColumn: this.onRenderItemColumn }));
        };
        return Posts;
    }(React.Component));
    Posts.defaultProps = {
        locale: "en-US",
    };
    load_themed_styles_1.loadStyles("\n    .ms-GroupHeader-title span:nth-child(2) {\n        display: none;\n    }\n    .ms-DetailsRow-fields {\n        line-height: 1.4;\n    }\n    .ms-DetailsRow-cell {\n        padding-top: 0;\n    }\n");
    var renderer = new marked.Renderer();
    renderer.link = function (href, title, text) {
        return "<a href=\"" + href + "\" target=\"_blank\" rel=\"noopener\">" + text + "</a>";
    };
    marked.setOptions({
        renderer: renderer,
        sanitize: true,
    });
    react_dom_1.render(React.createElement(Posts, null), document.getElementById("posts"));
});

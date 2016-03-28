import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


class Statistic extends Component {
    constructor(props) {
        super(props);
        this.handleFile = this.handleFile.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.state = {
            step: 0,
            claster: 0,
            item: 0,
            stat: null
        };


    }

    handleFile(e) {
        let self = this;
        const file = e.target.files[0];
        var r = new FileReader();
        r.onload = function (e) {
            const {result} = e.target;
            self.setState({stat: JSON.parse(result)});
        };
        r.readAsText(file);
    }


    render() {
        const {step,claster,item,stat} = this.state;
        let steps = undefined;
        let clasters = undefined;
        let items = undefined;
        let selectedItem = undefined;


        if (!!stat) {

            steps = stat.steps;

            if (!!steps[step]) {
                clasters = steps[step].clasters;

                if (!!clasters[claster]) {
                    items = clasters[claster].items;

                    if (!!items[item]) {
                        selectedItem = items[item];
                    }
                }
            }

        }
        return (
            <div>
                <h1>Statistic</h1>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6">
                            <input className="form-control" type="file" onChange={this.handleFile}/>
                        </div>
                        <div className="col-sm-2">
                            {this.renderSelect(steps, 'step')}
                        </div>
                        <div className="col-sm-2">
                            {this.renderSelect(clasters, 'claster')}
                        </div>
                        <div className="col-sm-2">
                            {this.renderSelect(items, 'item')}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    {this.renderBlock(selectedItem)}
                </div>
            </div>
        )

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    renderSelect(items, name) {
        if (!items) return null;
        return (
            <select className="form-control" value={this.state[name]} onChange={this.onChange} name={name}>
                {
                    items.map((item, i)=> {
                        return <option value={i} key={i}>{i}</option>
                    })
                }
            </select>
        )
    }

    renderBlock(items) {
        const maxWidth = 15;
        const size = 16;
        if (!items) return null;
        return <svg width={15 *size} height={20*size}>
            <g style={{
                        fillRule:'evenodd',
                        fill:"#f00",
                        stroke:"#000000",
                        strokeWidth:'1px',
                        strokeLinecap:"butt",
                        strokeLinejoin:"miter",
                        strokeOpacity:"1"}}
            >
                {
                    items.map((item, i)=> {
                        return (
                            <rect
                                style={{ fill: (item == 1)?"#053":"#eee"  }}
                                width={size}
                                height={size}
                                x={((i+1) % maxWidth)*size}
                                y={(Math.ceil((i+1) / maxWidth))*size}/>
                        )
                    })
                }
            </g>
        </svg>
    }
}


export default connect()(Statistic);

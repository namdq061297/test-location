import React, { Component, createRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    Image,
    FlatList,
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _action from '../../redux/action/ActionHandle';
import { LoadingIndicator, NoData, } from '../../components';
import { getSize, Colors } from '../../common';
import TabBar from './TabBar';
import ItemSneakers from './ItemSneakers';
import ItemGems from './ItemGems';
import ItemPromos from './ItemPromos';
import ItemUpgrade from './ItemUpgrade';
import Head from "./../../components/head/index";
import * as ApiServices from "./../../service/index";

const dataPromos = [
    {
        gemsId: 316942392,
        mint: 1,
        level: 1,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: '#33ff99'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 2,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'grey'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 3,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'blue'
    },
    {
        gemsId: 316942392,
        mint: 1,
        level: 4,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'orange'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 5,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: '#33ff99'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 2,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'grey'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 3,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'blue'
    },
    {
        gemsId: 316942392,
        mint: 1,
        level: 4,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: 'orange'
    },
    {
        gemsId: 316942392,
        mint: 2,
        level: 5,
        sol: 10000,
        img: 'https://stepn-simulator.xyz/static/simulator/img/sneakers.jpeg',
        color: '#33ff99'
    }
];

const isAndroid = Platform.OS === 'android'

class TabBag extends Component {
    constructor(props) {
        super(props);
        this.LowestPrice = new createRef();
        this.ModalInfoRef = new createRef();
        this.ModalBuyRef = new createRef();
        this.state = {
            modalVisibles: false,
            price: "0",
            dataSneakers: "",
            isPutShoe: false,
            isshoesIdWear: false,
            refreshing: false,
            loading: true,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000)
    }

    measureLowestPrice = () => {
        this.LowestPrice.measure(this.logLowestPriceLayout);
    };
    logLowestPriceLayout = (ox, oy, width, height, px, py) => {
        this.setState({
            ...this.state,
            ox: ox,
            oy: oy,
            width: width,
            height: height,
            px: px,
            py: py,
            visible: !this.state.visible
        });
    };

    _renderItem = ({ item, index }) => {
        const { screenState, getConstShoe } = this.props;
        const { isSneakers, isGems, isPromos, isGalleryMini, isUpgradeMini } =
            screenState;
        const constShoe = getConstShoe.data ? getConstShoe.data : [];
        if (isSneakers && isGalleryMini) {
            return <ItemSneakers item={item}
                index={index}
                price={this.state.price}
                putShoe={this.putShoe}
                onChangeText={this.onChangeText}
                isPutShoe={this.state.isPutShoe}
                shoesIdWear={this.shoesIdWear}
                isshoesIdWear={this.state.isshoesIdWear}
                constShoe={constShoe}
                ref={this.ModalInfoRef}
            />;
        }
        if (isSneakers && isUpgradeMini) {
            return <ItemUpgrade item={item} index={index} />;
        }
        if (isGems) {
            return <ItemGems item={item} index={index} />;
        }
        if (isPromos) {
            return <ItemPromos item={item} index={index} />;
        }
        return null;
    };

    renderFooter = () => {
        const { isFetching } = this.props;
        if (isFetching) {
            return (
                <View style={styles.containerFooter}>
                    <ActivityIndicator
                        color={Colors.BLUE}
                        size="large"
                        style={{ paddingVertical: 20 }}
                    />
                </View>
            );
        }
    };

    renderEmptyList = () => {
        const { isFetching, isFull } = this.props;
        if (!isFetching && !isFull) {
            return <NoData />;
        }
    };
    onChangeText = (name, itemValue) => {
        this.setState(state => {
            return {
                [name]: itemValue
            }
        })
    }
    colsePopupmodalTransfer = () => {

        this.ModalInfoRef.current.ClosemodalTransfer();
    }
    colsePopupmodalBuy = () => {
        this.ModalInfoRef.current.ClosemodalmodalBuy();
    }

    LoadData = () => {
        const { action } = this.props;
        ApiServices.shoes().then(res => {
            if (res.code === 200) {
                action.shoes(res.data);
                this.setShoeCurrentWear(res.data, action)
            }
        }).catch(err => {
            console.log('LoadData', err)
        })
    }
    shoesIdWear = (id) => {


        const { action } = this.props;
        this.setState(state => {
            return {
                isshoesIdWear: true,
            }
        }, () => {
            ApiServices.shoesIdWear({ _id: id }).then(res => {
                if (res.code === 200) {
                    alert(res.message);
                    action.shoesIdWear(res.data);
                    this.LoadData();
                    this.setState(state => {
                        return {
                            isshoesIdWear: false
                        }
                    }, () => {
                        // this.setmodalBuy(false);
                        // this.setmodalTransfer(false);
                    });
                }
                if (res.code === 404) {
                    alert(res.message)
                }
            }).catch(err => {
                alert("Fail!");
                this.setState(state => {
                    return {
                        isshoesIdWear: false
                    }
                });
            })

        })
    }
    putShoe = (isSelling, id) => {


        const { action } = this.props;
        const { price } = this.state;
        let pr = isSelling ? price : 0;
        this.setState(state => {
            return {
                isPutShoe: true,
            }
        }, () => {
            ApiServices.putShoesId({ price: pr, isSelling: isSelling, _id: id }).then(res => {
                console.log(res);
                if (res.code === 200) {
                    action.putShoesId(res.data);
                    this.LoadData();
                    this.setState(state => {
                        return {
                            isPutShoe: false
                        }
                    }, () => {
                        // this.setmodalBuy(false);
                        // this.setmodalTransfer(false);
                    });
                }
                if (res.code === 404) {
                    alert(res.message)
                }
            }).catch(err => {
                alert("Fail!");
                this.setState(state => {
                    return {
                        isPutShoe: false
                    }
                });
            })


        })

    }

    setShoeCurrentWear = (shoes, action) => {
        let data = shoes.data;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.isWearing) {
                action.shoeCurrentWear(element);
            }

        }
    }


    onRefresh = () => {
        this.setState(state => {
            return {
                refreshing: true
            }
        }, () => {
            this.LoadData();
            this.setState(state => {
                return {
                    refreshing: false
                }
            });

        })

    }

    render() {
        const { navigation, screenState, shoes } = this.props;
        const {
            isSneakers,
            isGems,
            isShoeBoxes,
            isPromos,
            isUpgradeMini,
            isGalleryMini
        } = screenState;
        const { loading } = this.state
        const dataSneakers = shoes.data ? shoes.data : [];
        const stylesContent = {
            flex:
                isAndroid
                    ? 0
                    : !screenState.isSneakers
                        ? 1 / 1.78
                        : 2 / 1.78,
            minHeight:
                isAndroid && screenState.isSneakers
                    ? getSize.scale(90)
                    : isAndroid && !screenState.isSneakers
                        ? getSize.scale(61)
                        : 0,
            marginHorizontal: getSize.scale(16),
            justifyContent: 'center'
        }

        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    style={styles.containerImgBackground}
                    source={{ uri: 'ic_background_shoping' }}
                />

                <View
                    style={styles.containerContent}>
                    <Head navigation={navigation} />
                </View>
                <View
                    style={stylesContent}>
                    <TabBar navigation={navigation} />
                </View>
                {loading ? <LoadingIndicator /> : <View style={{ flex: 8, paddingHorizontal: getSize.scale(8) }}>
                    {isSneakers && isUpgradeMini ? (
                        <ItemUpgrade />
                    ) : (
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.contentContainerFlatList}
                            keyExtractor={(item, index) => `${index}`}
                            data={
                                isSneakers && isGalleryMini
                                    ? dataSneakers
                                    : isGems
                                        ? dataSneakers
                                        : isShoeBoxes
                                            ? dataSneakers
                                            : isPromos
                                                ? dataPromos
                                                : []
                            }
                            renderItem={this._renderItem}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            ListEmptyComponent={() => (
                                <View
                                    style={{
                                        width: getSize.Width,
                                        height: getSize.Width,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Image
                                        source={{ uri: 'ic_shoe_das' }}
                                        style={{
                                            width: getSize.scale(142),
                                            height: getSize.scale(142)
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: 'rgba(167, 155, 191, 1)',
                                            fontStyle: 'italic',
                                            marginTop: getSize.scale(32)
                                        }}>
                                        There is no item
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => ({
    initReducer: state.initReducer,
    screenState: state.initReducer.screenState,
    shoes: state.initReducer.shoes,
    putShoesId: state.initReducer.putShoesId,
    shoesIdWear: state.initReducer.shoesIdWear,
    getConstShoe: state.initReducer.getConstShoe,
    userId: state.initReducer.userId,
});
const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(_action, dispatch)
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    containerFooter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerImgBackground: {
        width: getSize.Width,
        height: getSize.Height,
        position: 'absolute',
        resizeMode: 'contain',
        zIndex: -2
    },
    containerContent: {
        flex: isAndroid ? 0 : 1,
        minHeight: isAndroid ? getSize.scale(48) : 0,
        marginVertical: isAndroid ? getSize.scale(8) : 0
    },
    contentContainerFlatList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(TabBag);

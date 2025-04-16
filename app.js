// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sample data (in a real app, this would come from APIs)
const whaleWallets = [
  { name: "Ansem", address: "AVAZvHLR2PcWpDf8BXY4rVxNHYRBytycHkcB5z5QNXYm", emoji: "🚀" },
  // ... (all other whale wallets)
];

const cryptoInfluencers = [
  { name: "Ansem", handle: "blknoiz06" },
  // ... (all other influencers)
];

const recentCoins = ["BONK", "MYRO", "WIF", "POPCAT", "SILLY", "NOS", "BORK"];

// Whale Watch Tab Component
function WhaleWatchTab() {
  const [transactions, setTransactions] = useState([]);
  const [hotCoins, setHotCoins] = useState({});

  useEffect(() => {
    // Simulate WebSocket connection for real-time whale transactions
    const wsInterval = setInterval(() => {
      const randomWhale = whaleWallets[Math.floor(Math.random() * whaleWallets.length)];
      const randomCoin = recentCoins[Math.floor(Math.random() * recentCoins.length)];
      const isBuy = Math.random() > 0.3;
      const amount = Math.floor(Math.random() * 10000000).toLocaleString();
      const value = `$${(Math.random() * 20000).toFixed(2)}`;
      
      const newTx = {
        id: Date.now().toString(),
        whale: randomWhale,
        type: isBuy ? "buy" : "sell",
        coin: randomCoin,
        amount: amount,
        value: value,
        timestamp: new Date().getTime()
      };
      
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]); // Keep only 50 most recent
      
      // Update hot coins
      if (isBuy) {
        setHotCoins(prev => {
          const newHotCoins = {...prev};
          if (!newHotCoins[randomCoin]) {
            newHotCoins[randomCoin] = { count: 0, whales: [] };
          }
          
          if (!newHotCoins[randomCoin].whales.includes(randomWhale.name)) {
            newHotCoins[randomCoin].count++;
            newHotCoins[randomCoin].whales.push(randomWhale.name);
          }
          
          return newHotCoins;
        });
      }
    }, 3000); // New transaction every 3 seconds
    
    return () => clearInterval(wsInterval);
  }, []);

  // Get top 3 hot coins
  const trendingCoins = Object.entries(hotCoins)
    .filter(([_, data]) => data.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Hot Coins Banner */}
      {trendingCoins.length > 0 && (
        <View style={styles.hotCoinsBanner}>
          <Text style={styles.hotCoinsTitle}>🔥 Hot Coins:</Text>
          <View style={styles.hotCoinsList}>
            {trendingCoins.map(([coin, data]) => (
              <View key={coin} style={styles.hotCoin}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinIconText}>{coin.substring(0, 2)}</Text>
                </View>
                <Text style={styles.hotCoinText}>
                  {coin} ({data.count} whales)
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.whaleCard, item.type === 'buy' ? styles.buyCard : styles.sellCard]}>
            <View style={styles.whaleHeader}>
              <View style={styles.whaleAvatar}>
                <Text style={styles.whaleEmoji}>{item.whale.emoji}</Text>
              </View>
              <View>
                <Text style={styles.whaleName}>{item.whale.name}</Text>
                <Text style={styles.whaleAddress}>
                  {item.whale.address.substring(0, 6)}...{item.whale.address.slice(-4)}
                </Text>
              </View>
            </View>
            <View style={styles.transaction}>
              <View style={styles.coinInfo}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinIconText}>{item.coin.substring(0, 2)}</Text>
                </View>
                <View>
                  <Text style={item.type === 'buy' ? styles.buyText : styles.sellText}>
                    {item.type.toUpperCase()} {item.coin}
                  </Text>
                  <Text style={styles.txAmount}>{item.amount} ({item.value})</Text>
                </View>
              </View>
              <Text style={styles.txTime}>Just now</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent whale activity</Text>
          </View>
        }
      />
    </View>
  );
}

// Influencer Tweets Tab Component
function InfluencerTweetsTab() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Simulate WebSocket connection for real-time tweets
    const wsInterval = setInterval(() => {
      const randomInfluencer = cryptoInfluencers[Math.floor(Math.random() * cryptoInfluencers.length)];
      const randomCoin = recentCoins[Math.floor(Math.random() * recentCoins.length)];
      const tweetTexts = [
        `Just loaded up on $${randomCoin} - this meme coin has serious potential! #Solana`,
        `The AI coins on Solana are heating up. $${randomCoin} is my top pick right now.`,
        `$${randomCoin} showing strong momentum. Targets: 2x from here.`,
        `Why I'm bullish on $${randomCoin}: Strong community + low MC = potential moonshot.`,
        `$${randomCoin} breakout incoming. Accumulating at these levels.`
      ];
      
      const newTweet = {
        id: Date.now().toString(),
        user: randomInfluencer.name,
        handle: `@${randomInfluencer.handle}`,
        content: tweetTexts[Math.floor(Math.random() * tweetTexts.length)],
        likes: Math.floor(Math.random() * 5000) + 500,
        retweets: Math.floor(Math.random() * 1000) + 100,
        replies: Math.floor(Math.random() * 300) + 50,
        timestamp: new Date().getTime()
      };
      
      setTweets(prev => [newTweet, ...prev.slice(0, 49)]); // Keep only 50 most recent
    }, 5000); // New tweet every 5 seconds
    
    return () => clearInterval(wsInterval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tweetCard}>
            <View style={styles.tweetHeader}>
              <View style={styles.tweetAvatar}>
                <Text style={styles.tweetAvatarText}>{item.user.substring(0, 1)}</Text>
              </View>
              <View>
                <Text style={styles.tweetUser}>{item.user}</Text>
                <Text style={styles.tweetHandle}>{item.handle} · Just now</Text>
              </View>
            </View>
            <Text style={styles.tweetContent}>{item.content}</Text>
            <View style={styles.tweetActions}>
              <View style={styles.tweetAction}>
                <Ionicons name="heart-outline" size={16} color="#888" />
                <Text style={styles.tweetActionText}>
                  {item.likes > 1000 ? `${(item.likes/1000).toFixed(1)}K` : item.likes}
                </Text>
              </View>
              <View style={styles.tweetAction}>
                <Ionicons name="repeat-outline" size={16} color="#888" />
                <Text style={styles.tweetActionText}>
                  {item.retweets > 1000 ? `${(item.retweets/1000).toFixed(1)}K` : item.retweets}
                </Text>
              </View>
              <View style={styles.tweetAction}>
                <Ionicons name="chatbubble-outline" size={16} color="#888" />
                <Text style={styles.tweetActionText}>
                  {item.replies > 1000 ? `${(item.replies/1000).toFixed(1)}K` : item.replies}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent tweets</Text>
          </View>
        }
      />
    </View>
  );
}

// Telegram Calls Tab Component
function TelegramCallsTab() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    // Simulate WebSocket connection for real-time calls
    const wsInterval = setInterval(() => {
      const shuffledCoins = [...recentCoins].sort(() => 0.5 - Math.random());
      const selectedCoins = shuffledCoins.slice(0, 3); // 3 new calls
      
      const newCalls = selectedCoins.map((coin, index) => {
        const callCount = Math.floor(Math.random() * 100) + 20;
        const trend = Math.random() > 0.5 ? "up" : "down";
        const trendPercent = Math.floor(Math.random() * 50) + 5;
        
        // Select 1-2 random groups
        const groupCount = Math.floor(Math.random() * 2) + 1;
        const shuffledGroups = [
          "Alpha Sharks", "Solana Calls", "Whale Watch", 
          "Moon Group", "Crypto Signals"
        ].sort(() => 0.5 - Math.random());
        const groups = shuffledGroups.slice(0, groupCount);
        
        return {
          id: `${coin}-${Date.now()}`,
          rank: index + 1,
          coin: coin,
          groups: groups,
          callCount: callCount,
          trend: trend,
          trendPercent: trendPercent
        };
      });
      
      setCalls(prev => [...newCalls, ...prev.slice(0, 47)]); // Keep only 50 most recent
    }, 10000); // New calls every 10 seconds
    
    return () => clearInterval(wsInterval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.callCard}>
            <Text style={styles.callRank}>{item.rank}</Text>
            <View style={styles.callInfo}>
              <View style={styles.callCoin}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinIconText}>{item.coin.substring(0, 2)}</Text>
                </View>
                <Text style={styles.callCoinText}>{item.coin}</Text>
              </View>
              <Text style={styles.callGroup}>{item.groups.join(', ')}</Text>
              <View style={styles.trendIndicator}>
                <Ionicons 
                  name={item.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={16} 
                  color={item.trend === 'up' ? '#14F195' : '#FF5252'} 
                />
                <Text style={[
                  styles.trendText,
                  { color: item.trend === 'up' ? '#14F195' : '#FF5252' }
                ]}>
                  {item.trendPercent}% {item.trend}
                </Text>
              </View>
            </View>
            <View style={styles.callCount}>
              <Text style={styles.callCountText}>{item.callCount} calls</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent calls</Text>
          </View>
        }
      />
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Whale Watch') {
              iconName = focused ? 'fish' : 'fish-outline';
            } else if (route.name === 'Influencer Tweets') {
              iconName = focused ? 'logo-twitter' : 'logo-twitter';
            } else if (route.name === 'Telegram Calls') {
              iconName = focused ? 'paper-plane' : 'paper-plane-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#9945FF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333'
          },
          headerStyle: {
            backgroundColor: '#1A1A1A',
            shadowColor: 'transparent'
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTintColor: 'white'
        })}
      >
        <Tab.Screen name="Whale Watch" component={WhaleWatchTab} />
        <Tab.Screen name="Influencer Tweets" component={InfluencerTweetsTab} />
        <Tab.Screen name="Telegram Calls" component={TelegramCallsTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 10
  },
  hotCoinsBanner: {
    backgroundColor: 'rgba(153, 69, 255, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  hotCoinsTitle: {
    color: '#14F195',
    fontWeight: 'bold',
    marginRight: 10
  },
  hotCoinsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  hotCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  hotCoinText: {
    color: 'white',
    fontSize: 12
  },
  whaleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10
  },
  buyCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#14F195'
  },
  sellCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF5252'
  },
  whaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  whaleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9945FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  whaleEmoji: {
    fontSize: 18
  },
  whaleName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  whaleAddress: {
    color: '#888',
    fontSize: 12
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coinIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#14F195',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  coinIconText: {
    color: '#0F0F0F',
    fontSize: 10,
    fontWeight: 'bold'
  },
  buyText: {
    color: '#14F195',
    fontWeight: '600'
  },
  sellText: {
    color: '#FF5252',
    fontWeight: '600'
  },
  txAmount: {
    color: 'white',
    fontWeight: '600'
  },
  txTime: {
    color: '#888',
    fontSize: 12
  },
  tweetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10
  },
  tweetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  tweetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  tweetAvatarText: {
    color: 'white',
    fontWeight: 'bold'
  },
  tweetUser: {
    color: 'white',
    fontWeight: '600'
  },
  tweetHandle: {
    color: '#888',
    fontSize: 12
  },
  tweetContent: {
    color: 'white',
    marginBottom: 10,
    lineHeight: 20
  },
  tweetActions: {
    flexDirection: 'row',
    gap: 15
  },
  tweetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  tweetActionText: {
    color: '#888',
    fontSize: 14
  },
  callCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  callRank: {
    fontSize: 18,
    fontWeight: '700',
    width: 30,
    textAlign: 'center',
    color: '#14F195'
  },
  callInfo: {
    flex: 1,
    marginLeft: 15
  },
  callCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  callCoinText: {
    color: 'white',
    fontWeight: '600'
  },
  callGroup: {
    color: '#888',
    fontSize: 12
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5
  },
  trendText: {
    fontSize: 12
  },
  callCount: {
    backgroundColor: '#0088CC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  callCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16
  }
});

export default App;

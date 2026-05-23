import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { borderTopColor: '#eee' },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Scan', tabBarLabel: 'Scan' }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Food Log', tabBarLabel: 'Log' }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ title: 'Leaderboard', tabBarLabel: 'Leaderboard' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarLabel: 'Profile' }}
      />
    </Tabs>
  );
}

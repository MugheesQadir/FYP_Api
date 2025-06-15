package com.iotbasedsmarthomefinalscreens

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BackgroundServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BackgroundServiceModule"
    }

    @ReactMethod
    fun startService() {
        val serviceIntent = Intent(reactContext, BackgroundService::class.java)
        reactContext.startService(serviceIntent)
    }

    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactContext, BackgroundService::class.java)
        reactContext.stopService(serviceIntent)
    }
}

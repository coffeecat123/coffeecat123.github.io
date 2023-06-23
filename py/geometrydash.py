import pyautogui as p
import time as t
from pynput.mouse import Listener, Button
import os
p.FAILSAFE = True
p.PAUSE=0
def ck(key,hl,tm):
    t.sleep(tm)
    p.keyDown(key)
    t.sleep(hl)
    p.keyUp(key)

p.hotkey("win","7")
with open('ck.txt','r') as f:
    a=f.read()
    a1=a.split("\n")
    #print(a1)
    ck("r",0,1)
    for i in a1:
        a2=i.split(" ")
        if(i==""):
            continue
        if(i[0]=="#"):
            continue
        if(i[0]==";"):
            break
        ck("space",eval(a2[0]),eval(a2[1]))
print(2)
mdt=0
mdl=0
fl=""
def on_click(x, y, button, is_press):
    global start_time,mdt,mdl,fl
    if button == Button.right:
        print("點選右鍵，停止監控")
        with open('ck.txt','a') as f:
            f.write(fl)
        return False
    if(is_press):
        #print(2)
        mdt=t.time()-start_time
        mdl=t.time()
    elif(is_press==0):
        fl+=str(t.time()-mdl)+" "+str(mdt)+"\n"
        start_time=t.   time()

start_time=t.time()
with Listener(
    on_click=on_click
) as listener:
    listener.join()

---
uid: userdefinedfieldinfoagent-deleteuserdefinedfieldinfo
title: UserDefinedFieldInfoAgent.DeleteUserDefinedFieldInfo event method
description: Scripting events called on the DeleteUserDefinedFieldInfo method on the UserDefinedFieldInfoAgent service agent.
so.generated: true
keywords: netserver scripting
so.topic: reference
so.envir: onsite
---
# UserDefinedFieldInfoAgent.DeleteUserDefinedFieldInfo

Scripting events called on the <see cref='M:IUserDefinedFieldInfoAgent.DeleteUserDefinedFieldInfo'>DeleteUserDefinedFieldInfo</see> method on the <see cref='IUserDefinedFieldInfoAgent'>IUserDefinedFieldInfoAgent</see>  service agent.

## BeforeDeleteUserDefinedFieldInfo
```cs
    static void BeforeDeleteUserDefinedFieldInfo(
       Int32  userDefinedFieldInfoId,
       ref object  eventState
      );
```
Executes before the service method is invoked.
It can store some state in the *eventState* parameter, that is passed to the **After** and **AfterAsync** methods in this service call.
Event state is not preserved between different service calls. It is set to null at the start of each service call.
## AfterDeleteUserDefinedFieldInfo
```cs
    static void AfterDeleteUserDefinedFieldInfo(
       Int32  userDefinedFieldInfoId,
       ref object  eventState
      );
```
Executes after the service method has been invoked. The service waits for this method to complete before returning the result to the caller.
This service call has no return value, so there is no **returnValue** parameter
Any state you set in the **Before** method is passed in through the *eventState* parameter.
## AfterDeleteUserDefinedFieldInfoAsync
```cs
    static void AfterDeleteUserDefinedFieldInfoAsync(
       Int32  userDefinedFieldInfoId,
       ref object  eventState
      );
```
Executes after the service method is invoked, without waiting for the call to return.
The service call is not blocked waiting for this method to complete.
Any state you set in the **Before** method is passed in through the *eventState* parameter.


---
uid: listagent-setrankonsaledocument
title: ListAgent.SetRankOnSaleDocument event method
description: Scripting events called on the SetRankOnSaleDocument method on the ListAgent service agent.
so.generated: true
keywords: netserver scripting
so.topic: reference
so.envir: onsite
---
# ListAgent.SetRankOnSaleDocument

Scripting events called on the <see cref='M:IListAgent.SetRankOnSaleDocument'>SetRankOnSaleDocument</see> method on the <see cref='IListAgent'>IListAgent</see>  service agent.

## BeforeSetRankOnSaleDocument
```cs
    static void BeforeSetRankOnSaleDocument(
       Int32  saleTypeStageLinkId,
       Int32[]  itemsIds,
       ref object  eventState
      );
```
Executes before the service method is invoked.
It can store some state in the *eventState* parameter, that is passed to the **After** and **AfterAsync** methods in this service call.
Event state is not preserved between different service calls. It is set to null at the start of each service call.
## AfterSetRankOnSaleDocument
```cs
    static void AfterSetRankOnSaleDocument(
       Int32  saleTypeStageLinkId,
       Int32[]  itemsIds,
       ref object  eventState
      );
```
Executes after the service method has been invoked. The service waits for this method to complete before returning the result to the caller.
This service call has no return value, so there is no **returnValue** parameter
Any state you set in the **Before** method is passed in through the *eventState* parameter.
## AfterSetRankOnSaleDocumentAsync
```cs
    static void AfterSetRankOnSaleDocumentAsync(
       Int32  saleTypeStageLinkId,
       Int32[]  itemsIds,
       ref object  eventState
      );
```
Executes after the service method is invoked, without waiting for the call to return.
The service call is not blocked waiting for this method to complete.
Any state you set in the **Before** method is passed in through the *eventState* parameter.


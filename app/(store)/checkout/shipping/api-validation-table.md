GOOGLE ADDRESS VALIDATION API - API RESPONSE VALIDATION LOGIC TABLE

| Scenario      | Is Building? | Country Match? | Replaced? | Missing Apt? | STATUS  |
| :------------ | :----------: | :------------: | :-------: | :----------: | :------ |
| Perfect Match |     YES      |      YES       |    NO     |      NO      | ACCEPT  |
| Missing Apt   |     YES      |      YES       |    NO     |     YES      | CONFIRM |
| Wrong Country |     YES      |       NO       |     -     |      -       | FIX     |
| Street Only   |      NO      |       -        |     -     |      -       | FIX     |
| Garbage       |      NO      |       -        |     -     |      -       | FIX     |

WHY:

- google api response = collection of validity signals
- validation logic = processing validity signals to one output
- above table = strict processing. Minimizing risk of bad address passing through.
